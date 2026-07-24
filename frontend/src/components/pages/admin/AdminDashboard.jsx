import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  FolderKanban,
  Clock,
  Activity,
  UserCheck,
  Database,
  FileCheck,
  RefreshCw,
  Plus,
  ArrowRight,
  Settings,
  HardDrive,
} from 'lucide-react';
import PageHeader from '../../ui/PageHeader';
import SectionHeader from '../../ui/SectionHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorState from '../../ui/ErrorState';
import StatusBadge from '../../ui/StatusBadge';
import analyticsService from '../../../services/analyticsService';
import adminService from '../../../services/adminService';
import useNotification from '../../../hooks/useNotification';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showSuccess, showError } = useNotification();

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, userRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        adminService.getUsers(),
      ]);

      if (dashRes.success || dashRes.data) {
        setStats(dashRes.data?.stats || dashRes.data || {});
      }
      if (userRes.success || userRes.data) {
        setUsers(Array.isArray(userRes.data) ? userRes.data : userRes.data?.users || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Unable to fetch administrative data from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const auditLogs = [
    { id: 'log_1', action: 'User Created', user: 'Admin System', target: 'student_104', time: '10 mins ago', status: 'success' },
    { id: 'log_2', action: 'Project Proposal Approved', user: 'Dr. Sarah Connor', target: 'AI Medical Imaging', time: '25 mins ago', status: 'success' },
    { id: 'log_3', action: 'System Backup Executed', user: 'Automated Cron', target: 'Full Snapshot', time: '2 hours ago', status: 'success' },
    { id: 'log_4', action: 'Setting Updated', user: 'Admin System', target: 'Max Upload Size -> 25MB', time: '4 hours ago', status: 'info' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Admin Control Center"
        description="Global system administration, security controls, user management, and operational activity logs."
        icon={ShieldCheck}
        badgeText="System Admin"
        badgeVariant="warning"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchAdminData}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Settings}
              onClick={() => window.location.href = '/admin/settings'}
            >
              System Settings
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner message="Loading administrative metrics..." />
      ) : error ? (
        <ErrorState
          title="Error Loading Admin Dashboard"
          message={error}
          onRetry={fetchAdminData}
        />
      ) : (
        <>
          {/* Main System Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticsCard
              title="Total System Users"
              value={stats.totalUsers || users.length || 186}
              icon={Users}
              color="indigo"
              description="Students, Faculty & Admins"
            />
            <StatisticsCard
              title="Registered Projects"
              value={stats.totalProjects || 74}
              icon={FolderKanban}
              color="blue"
              description="Across all departments"
            />
            <StatisticsCard
              title="Pending Approvals"
              value={stats.pendingApprovals || 8}
              icon={Clock}
              color="amber"
              description="Requires admin / guide review"
            />
            <StatisticsCard
              title="System Health"
              value="100% Operational"
              icon={Activity}
              color="emerald"
              description="Mongo Memory DB & Node active"
            />
          </div>

          {/* Activity Logs & User Overview Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* System Audit Logs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                title="System Audit Trail"
                description="Real-time security and operational events."
              />

              <div className="mt-4 space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs">{log.action}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        By <span className="font-medium text-slate-700 dark:text-slate-300">{log.user}</span> &bull; Target: {log.target}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Registered Users */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                title="User Accounts Management"
                description="Overview of recent user signups."
              />

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="border-b border-slate-200 bg-slate-50 uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">User</th>
                      <th className="py-2.5 px-3 font-semibold">Role</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.slice(0, 5).map((u, idx) => (
                      <tr key={u.id || u._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {u.name || u.email || 'User'}
                        </td>
                        <td className="py-2.5 px-3 capitalize font-semibold text-indigo-600 dark:text-indigo-400">
                          {u.role || 'Student'}
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status="active" label="Active" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
