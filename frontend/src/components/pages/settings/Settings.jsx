import { useCallback, useMemo, useState, memo, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-hot-toast';

/**
 * Settings Component
 *
 * The central configuration engine for user preferences. Manages global
 * language/region defaults, notification subscription matrices,
 * granular privacy controls, and application-wide appearance themes.
 */
const Settings = memo(() => {
  const { themeMode, setThemeMode, THEME_MODES } = useTheme();
  const { user, updateSettings, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    language: 'English',
    timezone: 'UTC-05:00',
    dateFormat: 'MM/DD/YYYY',

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    meetingReminders: true,
    projectUpdates: true,
    weeklyReports: false,

    // Privacy Settings
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,

    // Appearance (theme is handled separately via context)
    fontSize: 'medium',
    density: 'comfortable',
    theme: 'auto',
  });

  // Load user settings on mount
  useEffect(() => {
    if (user && user.settings) {
      setSettings((prev) => ({
        ...prev,
        ...user.settings,
      }));
    }
  }, [user]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  // Handle theme change separately through context
  const handleThemeChange = useCallback(
    (e) => {
      const { value } = e.target;
      setThemeMode(value);
      setSettings((prev) => ({ ...prev, theme: value }));
    },
    [setThemeMode]
  );

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await updateSettings(settings);
    } finally {
      setLoading(false);
    }
  }, [settings, updateSettings]);

  const handleDeleteAccount = useCallback(async () => {
    if (
      window.confirm(
        'CRITICAL: Are you sure you want to PERMANENTLY delete your account? This action cannot be undone.'
      )
    ) {
      await deleteAccount();
    }
  }, [deleteAccount]);

  const handleExportData = useCallback(() => {
    // Mock export functionality
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({ user, exportDate: new Date().toISOString() })
      );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute(
      'download',
      `account_data_${user?.name || 'user'}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success('Your data has been exported successfully.');
  }, [user]);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all settings?')) {
      const defaultSettings = {
        language: 'English',
        timezone: 'UTC-05:00',
        dateFormat: 'MM/DD/YYYY',
        emailNotifications: true,
        pushNotifications: true,
        meetingReminders: true,
        projectUpdates: true,
        weeklyReports: false,
        profileVisibility: 'public',
        showEmail: true,
        showPhone: false,
        fontSize: 'medium',
        density: 'comfortable',
        theme: THEME_MODES.AUTO,
      };
      setSettings(defaultSettings);
      setThemeMode(THEME_MODES.AUTO);
      updateSettings(defaultSettings);
    }
  }, [setThemeMode, THEME_MODES, updateSettings]);

  const tabs = useMemo(
    () => [
      { id: 'general', label: 'General', icon: 'fa-cog' },
      { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
      { id: 'privacy', label: 'Privacy', icon: 'fa-lock' },
      { id: 'appearance', label: 'Appearance', icon: 'fa-palette' },
      { id: 'account', label: 'Account', icon: 'fa-user-cog' },
    ],
    []
  );

  const notificationItems = useMemo(
    () => [
      {
        name: 'emailNotifications',
        label: 'Email Notifications',
        description: 'Receive notifications via email',
      },
      {
        name: 'pushNotifications',
        label: 'Push Notifications',
        description: 'Receive browser push notifications',
      },
      {
        name: 'meetingReminders',
        label: 'Meeting Reminders',
        description: 'Get reminded about upcoming meetings',
      },
      {
        name: 'projectUpdates',
        label: 'Project Updates',
        description: 'Updates on project status changes',
      },
      {
        name: 'weeklyReports',
        label: 'Weekly Reports',
        description: 'Receive weekly summary reports',
      },
    ],
    []
  );

  const privacyOptions = useMemo(
    () => [
      {
        value: 'public',
        label: 'Public',
        description: 'Anyone can see your profile',
      },
      {
        value: 'community',
        label: 'Community Only',
        description: 'Only registered users can see your profile',
      },
      {
        value: 'private',
        label: 'Private',
        description: 'Only you can see your profile',
      },
    ],
    []
  );

  const themes = useMemo(
    () => [
      { value: 'light', label: 'Light', icon: 'fa-sun' },
      { value: 'dark', label: 'Dark', icon: 'fa-moon' },
      { value: 'auto', label: 'Auto', icon: 'fa-adjust' },
    ],
    []
  );

  const themeIconClass = {
    light: 'text-yellow-500',
    dark: 'text-slate-300',
    auto: 'text-slate-500',
  };

  const renderGeneralSettings = () => (
    <div className='space-y-6'>
      <div>
        <h4 className='mb-4 font-semibold text-slate-900 dark:text-slate-100'>
          Language & Region
        </h4>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
              Language
            </label>
            <select
              name='language'
              value={settings.language}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
              Timezone
            </label>
            <select
              name='timezone'
              value={settings.timezone}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
            >
              <option>UTC-05:00 (Eastern Time)</option>
              <option>UTC-06:00 (Central Time)</option>
              <option>UTC-07:00 (Mountain Time)</option>
              <option>UTC-08:00 (Pacific Time)</option>
              <option>UTC+00:00 (GMT)</option>
            </select>
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
              Date Format
            </label>
            <select
              name='dateFormat'
              value={settings.dateFormat}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className='space-y-6'>
      <h4 className='mb-4 font-semibold text-slate-900 dark:text-slate-100'>
        Notification Preferences
      </h4>
      <div className='space-y-4'>
        {notificationItems.map((item) => (
          <div
            key={item.name}
            className='flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
          >
            <div>
              <p className='font-medium text-slate-900 dark:text-slate-100'>
                {item.label}
              </p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                {item.description}
              </p>
            </div>
            <label className='relative inline-flex cursor-pointer items-center'>
              <input
                type='checkbox'
                name={item.name}
                checked={settings[item.name]}
                onChange={handleChange}
                className='peer sr-only'
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-slate-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className='space-y-6'>
      <div>
        <h4 className='mb-4 font-semibold text-slate-900 dark:text-slate-100'>
          Profile Visibility
        </h4>
        <div className='space-y-3'>
          {privacyOptions.map((option) => (
            <label
              key={option.value}
              className='flex cursor-pointer items-center rounded-lg border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
            >
              <input
                type='radio'
                name='profileVisibility'
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={handleChange}
                className='h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600'
              />
              <div className='ml-3'>
                <p className='font-medium text-slate-900 dark:text-slate-100'>
                  {option.label}
                </p>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className='mb-4 font-semibold text-slate-900 dark:text-slate-100'>
          Contact Information
        </h4>
        <div className='space-y-4'>
          <label className='flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'>
            <div>
              <p className='font-medium text-slate-900 dark:text-slate-100'>
                Show Email Address
              </p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                Allow others to see your email
              </p>
            </div>
            <input
              type='checkbox'
              name='showEmail'
              checked={settings.showEmail}
              onChange={handleChange}
              className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600'
            />
          </label>
          <label className='flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'>
            <div>
              <p className='font-medium text-slate-900 dark:text-slate-100'>
                Show Phone Number
              </p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                Allow others to see your phone number
              </p>
            </div>
            <input
              type='checkbox'
              name='showPhone'
              checked={settings.showPhone}
              onChange={handleChange}
              className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600'
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className='space-y-6'>
      <div>
        <h4 className='mb-4 font-semibold text-slate-900 dark:text-slate-100'>
          Theme
        </h4>
        <p className='mb-4 text-sm text-slate-500 dark:text-slate-400'>
          Choose how the application looks. Auto mode follows your system
          preference.
        </p>
        <div className='grid grid-cols-3 gap-4'>
          {themes.map((theme) => (
            <label key={theme.value} className='relative'>
              <input
                type='radio'
                name='theme'
                value={theme.value}
                checked={themeMode === theme.value}
                onChange={handleThemeChange}
                className='peer sr-only'
              />
              <div className='cursor-pointer rounded-lg border-2 border-slate-200 p-4 text-center transition-all duration-200 hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:border-slate-700 dark:peer-checked:bg-blue-950/40'>
                <i
                  className={`fas ${theme.icon} mb-2 text-2xl ${themeIconClass[theme.value]}`}
                ></i>
                <p className='font-medium text-slate-900 dark:text-slate-100'>
                  {theme.label}
                </p>
                {/* {theme.value === "auto" && (
                  // <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  //   Syncs with OS
                  // </p>
                )} */}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
            Font Size
          </label>
          <select
            name='fontSize'
            value={settings.fontSize}
            onChange={handleChange}
            className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
          >
            <option value='small'>Small</option>
            <option value='medium'>Medium</option>
            <option value='large'>Large</option>
          </select>
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
            Density
          </label>
          <select
            name='density'
            value={settings.density}
            onChange={handleChange}
            className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
          >
            <option value='compact'>Compact</option>
            <option value='comfortable'>Comfortable</option>
            <option value='spacious'>Spacious</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className='space-y-6'>
      <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30'>
        <div className='flex'>
          <i className='fas fa-exclamation-triangle mr-3 mt-1 text-amber-600 dark:text-amber-400'></i>
          <div>
            <h4 className='font-medium text-amber-800 dark:text-amber-200'>
              Account Management
            </h4>
            <p className='mt-1 text-sm text-amber-700 dark:text-amber-300'>
              These actions are irreversible. Please proceed with caution.
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'>
          <h4 className='mb-2 font-semibold text-slate-900 dark:text-slate-100'>
            Export Data
          </h4>
          <p className='mb-3 text-sm text-slate-500 dark:text-slate-400'>
            Download all your data from this platform
          </p>
          <button
            onClick={handleExportData}
            className='rounded-lg bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/40'
          >
            <i className='fas fa-download mr-2'></i> Export My Data
          </button>
        </div>

        <div className='rounded-lg border border-rose-200 p-4 dark:border-rose-900/50'>
          <h4 className='mb-2 font-semibold text-rose-800 dark:text-rose-200'>
            Delete Account
          </h4>
          <p className='mb-3 text-sm text-rose-600 dark:text-rose-300'>
            This will permanently delete your account and all data
          </p>
          <button
            onClick={handleDeleteAccount}
            className='rounded-lg bg-rose-50 px-4 py-2 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40'
          >
            <i className='fas fa-trash mr-2'></i> Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Application Settings'
        subtitle='Customize your regional settings, notifications, privacy controls, and theme preferences'
        icon={Sliders}
      />

      <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900'>
        {/* Settings Tabs */}
        <div className='border-b border-slate-200 dark:border-slate-700'>
          <div className='flex overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition duration-150 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-300'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'privacy' && renderPrivacySettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'account' && renderAccountSettings()}
        </div>

        {/* Action Buttons */}
        <div className='border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800'>
          <div className='flex justify-between'>
            <button
              onClick={handleReset}
              className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition duration-150 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700'
            >
              Reset to Default
            </button>
            <div className='space-x-3'>
              <button
                onClick={() => setActiveTab('general')}
                className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition duration-150 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className='rounded-lg bg-blue-600 px-4 py-2 text-white transition duration-150 hover:bg-blue-700 disabled:opacity-50'
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Settings.displayName = 'Settings';

export default Settings;
