import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

const BackupRestore = memo(() => {
  const navigate = useNavigate();
  const [backups, setBackups] = useState([]);
  const [backupsLoading, setBackupsLoading] = useState(true);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const response = await api.get('/admin/backups');
        setBackups(response.data || []);
      } catch (error) {
        console.error('Failed to fetch backups', error);
      } finally {
        setBackupsLoading(false);
      }
    };
    fetchBackups();
  }, []);

  const [backupType, setBackupType] = useState('full');
  const [loading, setLoading] = useState(false);

  const handleBackup = useCallback(async () => {
    setLoading(true);
    try {
      await api.post('/admin/backups', { type: backupType });
      toast.success(
        `${
          backupType === 'full' ? 'Full' : 'Incremental'
        } backup initiated successfully`
      );
      // Refresh list
      const response = await api.get('/admin/backups');
      setBackups(response.data || []);
    } catch (error) {
      console.error('Backup failed', error);
      toast.error('Backup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [backupType]);

  const handleRestore = useCallback((backupId) => {
    toast.success(`Restore process initiated for backup ${backupId}`);
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Backup & Restore
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              Manage system backups and restoration
            </p>
          </div>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Create Backup Section */}
          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Create Backup
            </h3>
            <div className='space-y-6'>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Backup Type
                </label>
                <div className='grid grid-cols-2 gap-4'>
                  <button
                    type='button'
                    onClick={() => setBackupType('full')}
                    className={`rounded-lg border px-4 py-3 text-center transition-colors ${
                      backupType === 'full'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className='font-medium'>Full Backup</div>
                    <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                      Complete system backup
                    </div>
                  </button>
                  <button
                    type='button'
                    onClick={() => setBackupType('incremental')}
                    className={`rounded-lg border px-4 py-3 text-center transition-colors ${
                      backupType === 'incremental'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className='font-medium'>Incremental</div>
                    <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                      Backup changes only
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Include Data
                </label>
                <div className='space-y-2'>
                  {[
                    'User Data',
                    'Project Files',
                    'Database',
                    'System Logs',
                    'Configuration',
                  ].map((item, idx) => (
                    <label key={idx} className='flex items-center'>
                      <input
                        type='checkbox'
                        defaultChecked
                        className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600'
                      />
                      <span className='ml-2 text-slate-700 dark:text-slate-300'>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBackup}
                disabled={loading}
                className='w-full rounded-lg bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-800'
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <div className='mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                    Creating Backup...
                  </div>
                ) : (
                  `Create ${
                    backupType === 'full' ? 'Full' : 'Incremental'
                  } Backup`
                )}
              </button>
            </div>
          </div>

          {/* Backup List */}
          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Available Backups
            </h3>
            <div className='space-y-4'>
              {backupsLoading ? (
                <div className='py-4 text-center text-slate-500'>
                  Loading backups...
                </div>
              ) : backups.length === 0 ? (
                <div className='py-4 text-center text-slate-500'>
                  No backups found.
                </div>
              ) : (
                backups.map((backup) => (
                  <div
                    key={backup.id || backup._id}
                    className='flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700'
                  >
                    <div>
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {backup.name}
                      </div>
                      <div className='text-sm text-slate-600 dark:text-slate-400'>
                        {backup.type} • {backup.size} •{' '}
                        {backup.date || new Date().toLocaleString()}
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleRestore(backup.id || backup._id)}
                        className='rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                      >
                        Restore
                      </button>
                      <button className='rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'>
                        Download
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
            Backup Settings
          </h3>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Backup Schedule
              </label>
              <select className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-600'>
                <option>Daily at 2:00 AM</option>
                <option>Weekly on Sunday</option>
                <option>Monthly on 1st</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Retention Period
              </label>
              <select className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-600'>
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Storage Location
              </label>
              <select className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-600'>
                <option>Local Server</option>
                <option>Cloud Storage</option>
                <option>External Drive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BackupRestore.displayName = 'BackupRestore';

export default BackupRestore;
