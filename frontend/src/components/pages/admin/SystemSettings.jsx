import { useState, useCallback, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Settings as SettingsIcon } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';
import '../../../assets/styles/admin.css';

const SystemSettings = memo(() => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    systemName: '',
    maintenanceMode: false,
    emailNotifications: false,
    fileUploadLimit: 0,
    sessionTimeout: 0,
    backupFrequency: 'daily',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await api.put('/settings', settings);
        toast.success('Settings updated successfully');
      } catch (error) {
        console.error('Failed to update settings', error);
        toast.error('Failed to update settings');
      } finally {
        setLoading(false);
      }
    },
    [settings]
  );

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='System Settings'
        subtitle='Global platform configuration and parameters'
        icon={SettingsIcon}
        actions={
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50'
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        }
      />

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <section className='admin-card'>
            <h3 className='mb-6 text-lg font-bold'>General Configuration</h3>
            <div className='space-y-6'>
              <div className='admin-form-group'>
                <label className='admin-label'>System Name</label>
                <input
                  type='text'
                  className='admin-input'
                  value={settings.systemName}
                  onChange={(e) =>
                    setSettings({ ...settings, systemName: e.target.value })
                  }
                  placeholder='e.g. Student Project Management System'
                />
              </div>

              <div className='flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700/30'>
                <div>
                  <div className='font-semibold text-slate-900 dark:text-white'>
                    Maintenance Mode
                  </div>
                  <div className='text-sm text-slate-500'>
                    Temporarily disable public access to the system
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    setSettings({
                      ...settings,
                      maintenanceMode: !settings.maintenanceMode,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-rose-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className='admin-card'>
            <h3 className='mb-6 text-lg font-bold'>
              System Limits & Performance
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='admin-form-group'>
                <label className='admin-label'>File Upload Limit (MB)</label>
                <input
                  type='number'
                  className='admin-input'
                  value={settings.fileUploadLimit}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      fileUploadLimit: parseInt(e.target.value),
                    })
                  }
                />
                <p className='mt-1 text-[11px] text-slate-400'>
                  Maximum size allowed for document uploads
                </p>
              </div>
              <div className='admin-form-group'>
                <label className='admin-label'>Session Timeout (min)</label>
                <input
                  type='number'
                  className='admin-input'
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionTimeout: parseInt(e.target.value),
                    })
                  }
                />
                <p className='mt-1 text-[11px] text-slate-400'>
                  Automatic logout after inactivity
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className='space-y-6'>
          <section className='admin-card'>
            <h3 className='mb-6 text-lg font-bold'>Backup & Recovery</h3>
            <div className='admin-form-group'>
              <label className='admin-label'>Backup Frequency</label>
              <select
                className='admin-input'
                value={settings.backupFrequency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    backupFrequency: e.target.value,
                  })
                }
              >
                <option value='hourly'>Hourly</option>
                <option value='daily'>Daily</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
              </select>
            </div>
            <button className='admin-btn admin-btn-secondary mt-4 w-full text-sm'>
              Run Manual Backup Now
            </button>
          </section>

          <section className='admin-card'>
            <h3 className='mb-6 text-lg font-bold'>Notifications</h3>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-semibold text-slate-900 dark:text-white'>
                  Email Notifications
                </div>
                <div className='text-xs text-slate-500'>
                  Alert admins on critical events
                </div>
              </div>
              <button
                type='button'
                onClick={() =>
                  setSettings({
                    ...settings,
                    emailNotifications: !settings.emailNotifications,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});

SystemSettings.displayName = 'SystemSettings';

export default SystemSettings;
