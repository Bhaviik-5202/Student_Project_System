import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Shield,
  Bell,
  HardDrive,
  Clock,
  Database,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import SectionHeader from '../../ui/SectionHeader';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import settingService from '../../../services/settingService';
import useNotification from '../../../hooks/useNotification';

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    systemName: 'Student Project Management System',
    academicYear: '2025-2026',
    currentSemester: 'Fall 2026',
    maintenanceMode: false,
    emailNotifications: true,
    fileUploadLimit: 25,
    allowedFileFormats: 'pdf, docx, pptx, zip',
    sessionTimeout: 60,
    backupFrequency: 'daily',
    autoAssignGuides: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useNotification();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingService.getAll();
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          const map = {};
          res.data.forEach((s) => {
            map[s.key] = s.value;
          });
          setSettings((prev) => ({ ...prev, ...map }));
        } else if (typeof res.data === 'object') {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await settingService.bulkUpdate(settings);
      if (res.success || !res.error) {
        showSuccess('System settings updated successfully!');
      } else {
        showError(res.message || 'Failed to update settings.');
      }
    } catch (err) {
      showError('Error saving system settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleField = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return <LoadingSpinner message='Loading system settings...' />;
  }

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        title='System Configuration'
        subtitle='Global system parameters, academic policies, security thresholds, and automated backup rules.'
        icon={SettingsIcon}
        badge='Admin Controls'
        actions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              icon={RefreshCw}
              onClick={fetchSettings}
            >
              Reset
            </Button>
            <Button
              variant='primary'
              size='sm'
              icon={Save}
              loading={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        }
      />

      <form
        onSubmit={handleSave}
        className='grid grid-cols-1 gap-6 lg:grid-cols-3'
      >
        {/* Left 2 Columns - Settings Groups */}
        <div className='space-y-6 lg:col-span-2'>
          {/* General Platform Settings */}
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
            <SectionHeader
              title='General Identity & Term'
              description='Basic platform naming and academic term identifiers.'
            />

            <div className='mt-4 space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                  System Title
                </label>
                <input
                  type='text'
                  value={settings.systemName}
                  onChange={(e) =>
                    setSettings({ ...settings, systemName: e.target.value })
                  }
                  className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                    Academic Year
                  </label>
                  <input
                    type='text'
                    value={settings.academicYear}
                    onChange={(e) =>
                      setSettings({ ...settings, academicYear: e.target.value })
                    }
                    className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                    Current Term / Semester
                  </label>
                  <input
                    type='text'
                    value={settings.currentSemester}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currentSemester: e.target.value,
                      })
                    }
                    className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Uploads & Media Constraints */}
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
            <SectionHeader
              title='Storage & Attachment Rules'
              description='Configure upload size limits and allowed file extensions.'
            />

            <div className='mt-4 space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                    Max File Size (MB)
                  </label>
                  <input
                    type='number'
                    value={settings.fileUploadLimit}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        fileUploadLimit: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                    Session Timeout (Mins)
                  </label>
                  <input
                    type='number'
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sessionTimeout: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                  Allowed Extensions
                </label>
                <input
                  type='text'
                  value={settings.allowedFileFormats}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      allowedFileFormats: e.target.value,
                    })
                  }
                  className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                />
              </div>
            </div>
          </div>

          {/* Toggles & Automation */}
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
            <SectionHeader
              title='System Policies & Toggles'
              description='Control platform availability, automated emails, and guide assignments.'
            />

            <div className='mt-4 space-y-3'>
              <div className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 dark:border-slate-800 /50'>
                <div>
                  <p className='font-semibold text-slate-900 dark:text-white'>
                    Maintenance Mode
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                    Temporarily restrict access for scheduled maintenance.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => toggleField('maintenanceMode')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.maintenanceMode
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow-xs transition-transform ${
                      settings.maintenanceMode
                        ? 'translate-x-5'
                        : 'translate-x-0.5'
                    } my-0.5`}
                  />
                </button>
              </div>

              <div className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 dark:border-slate-800 /50'>
                <div>
                  <p className='font-semibold text-slate-900 dark:text-white'>
                    Email Notifications
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                    Send automatic status updates & submission alerts.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => toggleField('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.emailNotifications
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow-xs transition-transform ${
                      settings.emailNotifications
                        ? 'translate-x-5'
                        : 'translate-x-0.5'
                    } my-0.5`}
                  />
                </button>
              </div>

              <div className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 dark:border-slate-800 /50'>
                <div>
                  <p className='font-semibold text-slate-900 dark:text-white'>
                    Auto-Assign Faculty Guides
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                    Automatically assign guides based on topic tags.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => toggleField('autoAssignGuides')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.autoAssignGuides
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow-xs transition-transform ${
                      settings.autoAssignGuides
                        ? 'translate-x-5'
                        : 'translate-x-0.5'
                    } my-0.5`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Backup Schedule & Info */}
        <div className='space-y-6'>
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
            <SectionHeader
              title='Automated Backups'
              description='Schedule database snapshots.'
            />

            <div className='mt-4 space-y-4'>
              <Select
                label='Backup Frequency'
                value={settings.backupFrequency}
                onChange={(e) =>
                  setSettings({ ...settings, backupFrequency: e.target.value })
                }
                options={[
                  { value: 'hourly', label: 'Hourly' },
                  { value: 'daily', label: 'Daily (2:00 AM)' },
                  { value: 'weekly', label: 'Weekly (Sundays)' },
                  { value: 'disabled', label: 'Disabled' },
                ]}
              />

              <div className='rounded-xl bg-indigo-50/70 p-4 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40'>
                <div className='flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300'>
                  <Database className='h-4 w-4' />
                  Database Health Check
                </div>
                <p className='mt-1 text-xs text-slate-600 dark:text-slate-300'>
                  In-Memory Mongo DB instance active & connected.
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
            <SectionHeader
              title='System Status'
              description='Platform summary'
            />
            <div className='mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400'>
              <div className='flex justify-between py-1 border-b border-slate-100 dark:border-slate-800'>
                <span>API Status</span>
                <span className='font-semibold text-emerald-600'>
                  Online (HTTP 200)
                </span>
              </div>
              <div className='flex justify-between py-1 border-b border-slate-100 dark:border-slate-800'>
                <span>Database Engine</span>
                <span className='font-semibold text-slate-900 dark:text-white'>
                  MongoDB Memory Server
                </span>
              </div>
              <div className='flex justify-between py-1 border-b border-slate-100 dark:border-slate-800'>
                <span>Node Environment</span>
                <span className='font-semibold text-slate-900 dark:text-white'>
                  v20.x ESM
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
