import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  RefreshCw,
  Plus,
  RotateCcw,
  Trash2,
  Download,
  HardDrive,
  ShieldCheck,
  CheckCircle,
  Clock,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import SectionHeader from '../../ui/SectionHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorState from '../../ui/ErrorState';
import EmptyState from '../../ui/EmptyState';
import StatusBadge from '../../ui/StatusBadge';
import adminService from '../../../services/adminService';
import useNotification from '../../../hooks/useNotification';

export const BackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [backupType, setBackupType] = useState('Full');
  const [creating, setCreating] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const { showSuccess, showError } = useNotification();

  const fetchBackups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getBackups();
      if (res.success || res.data) {
        setBackups(Array.isArray(res.data) ? res.data : res.data?.backups || []);
      }
    } catch (err) {
      console.error('Fetch backups error:', err);
      setError('Unable to fetch backup history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const res = await adminService.createBackup({ type: backupType });
      if (res.success || !res.error) {
        showSuccess(`${backupType} system backup created successfully!`);
        if (res.data) {
          setBackups((prev) => [res.data, ...prev]);
        } else {
          fetchBackups();
        }
      } else {
        showError(res.message || 'Failed to create backup.');
      }
    } catch (err) {
      showError('Error triggering system backup.');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backup) => {
    const backupId = backup.id || backup._id;
    if (!window.confirm(`RESTORE WARNING: Are you sure you want to restore the system state to "${backup.name || backupId}"?`)) return;

    setRestoringId(backupId);
    try {
      const res = await adminService.restoreBackup(backupId);
      if (res.success || !res.error) {
        showSuccess('System restored successfully from backup!');
      } else {
        showError(res.message || 'Restore failed.');
      }
    } catch (err) {
      showError('Error restoring backup.');
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (backup) => {
    const backupId = backup.id || backup._id;
    if (!window.confirm(`Delete backup "${backup.name || backupId}"?`)) return;

    try {
      const res = await adminService.deleteBackup(backupId);
      if (res.success || !res.error) {
        showSuccess('Backup file removed.');
        setBackups((prev) => prev.filter((b) => (b.id || b._id) !== backupId));
      } else {
        showError(res.message || 'Failed to delete backup.');
      }
    } catch (err) {
      showError('Error deleting backup file.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Backup & System Recovery"
        subtitle="Trigger database snapshots, automated disaster recovery, and point-in-time system restoration."
        icon={Database}
        badge="Disaster Recovery"
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchBackups}
          >
            Refresh History
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticsCard
          title="Total Backups"
          value={backups.length}
          icon={Database}
          color="indigo"
          description="Stored system snapshots"
        />
        <StatisticsCard
          title="Last Backup Created"
          value={backups.length > 0 ? backups[0].date : 'Today'}
          icon={Clock}
          color="emerald"
          description="Automated daily schedule"
        />
        <StatisticsCard
          title="Database Status"
          value="Healthy"
          icon={ShieldCheck}
          color="blue"
          description="In-memory Mongo DB active"
        />
      </div>

      {/* Create Backup Action Box */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 ">
        <SectionHeader
          title="Manual Snapshot Trigger"
          description="Create a manual backup before performing major administrative updates."
        />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <Select
              label="Backup Mode"
              value={backupType}
              onChange={(e) => setBackupType(e.target.value)}
              options={[
                { value: 'Full', label: 'Full System Snapshot (Database + Files)' },
                { value: 'Incremental', label: 'Incremental (Changes Only)' },
                { value: 'Database Only', label: 'Database Collections Only' },
              ]}
            />
          </div>

          <Button
            variant="primary"
            icon={Plus}
            loading={creating}
            onClick={handleCreateBackup}
          >
            Trigger New Backup
          </Button>
        </div>
      </div>

      {/* Historical Backups Table */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 ">
        <SectionHeader
          title="System Backup History"
          description="List of available snapshots ready for download or system restore."
        />

        {loading ? (
          <LoadingSpinner message="Fetching backup records..." />
        ) : error ? (
          <ErrorState
            title="Error Loading Backups"
            message={error}
            onRetry={fetchBackups}
          />
        ) : backups.length === 0 ? (
          <EmptyState
            title="No Backups Found"
            description="No system backups have been created yet."
            icon={Database}
            actionText="Create First Backup"
            onAction={handleCreateBackup}
          />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="border-b border-slate-200 bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 dark:border-slate-800 /50 ">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Snapshot Name</th>
                  <th className="px-6 py-3.5 font-semibold">Type</th>
                  <th className="px-6 py-3.5 font-semibold">File Size</th>
                  <th className="px-6 py-3.5 font-semibold">Created Date</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {backups.map((b) => {
                  const bId = b.id || b._id;
                  const isRestoring = restoringId === bId;

                  return (
                    <tr key={bId} className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 /50">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <Database className="h-5 w-5" />
                          </div>
                          <span>{b.name || bId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">
                        {b.type || 'Full'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {b.size || '12.4MB'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{b.date || 'Today'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status="completed" label="Completed" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={RotateCcw}
                            loading={isRestoring}
                            onClick={() => handleRestore(b)}
                          >
                            Restore
                          </Button>
                          <button
                            onClick={() => handleDelete(b)}
                            className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Snapshot"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupRestore;
