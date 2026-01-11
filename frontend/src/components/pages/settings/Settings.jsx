import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    // General Settings
    language: "English",
    timezone: "UTC-05:00",
    dateFormat: "MM/DD/YYYY",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    meetingReminders: true,
    projectUpdates: true,
    weeklyReports: false,

    // Privacy Settings
    profileVisibility: "public",
    showEmail: true,
    showPhone: false,

    // Appearance
    theme: "light",
    fontSize: "medium",
    density: "comfortable",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings?")) {
      setSettings({
        language: "English",
        timezone: "UTC-05:00",
        dateFormat: "MM/DD/YYYY",
        emailNotifications: true,
        pushNotifications: true,
        meetingReminders: true,
        projectUpdates: true,
        weeklyReports: false,
        profileVisibility: "public",
        showEmail: true,
        showPhone: false,
        theme: "light",
        fontSize: "medium",
        density: "comfortable",
      });
      alert("Settings have been reset to default.");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "fa-cog" },
    { id: "notifications", label: "Notifications", icon: "fa-bell" },
    { id: "privacy", label: "Privacy", icon: "fa-lock" },
    { id: "appearance", label: "Appearance", icon: "fa-palette" },
    { id: "account", label: "Account", icon: "fa-user-cog" },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Language & Region</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option>UTC-05:00 (Eastern Time)</option>
              <option>UTC-06:00 (Central Time)</option>
              <option>UTC-07:00 (Mountain Time)</option>
              <option>UTC-08:00 (Pacific Time)</option>
              <option>UTC+00:00 (GMT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Format
            </label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
    <div className="space-y-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        Notification Preferences
      </h4>
      <div className="space-y-4">
        {[
          {
            name: "emailNotifications",
            label: "Email Notifications",
            description: "Receive notifications via email",
          },
          {
            name: "pushNotifications",
            label: "Push Notifications",
            description: "Receive browser push notifications",
          },
          {
            name: "meetingReminders",
            label: "Meeting Reminders",
            description: "Get reminded about upcoming meetings",
          },
          {
            name: "projectUpdates",
            label: "Project Updates",
            description: "Updates on project status changes",
          },
          {
            name: "weeklyReports",
            label: "Weekly Reports",
            description: "Receive weekly summary reports",
          },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name={item.name}
                checked={settings[item.name]}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Profile Visibility</h4>
        <div className="space-y-3">
          {[
            {
              value: "public",
              label: "Public",
              description: "Anyone can see your profile",
            },
            {
              value: "community",
              label: "Community Only",
              description: "Only registered users can see your profile",
            },
            {
              value: "private",
              label: "Private",
              description: "Only you can see your profile",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">
          Contact Information
        </h4>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">Show Email Address</p>
              <p className="text-sm text-gray-500">
                Allow others to see your email
              </p>
            </div>
            <input
              type="checkbox"
              name="showEmail"
              checked={settings.showEmail}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </label>
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">Show Phone Number</p>
              <p className="text-sm text-gray-500">
                Allow others to see your phone number
              </p>
            </div>
            <input
              type="checkbox"
              name="showPhone"
              checked={settings.showPhone}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Theme</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "light", label: "Light", icon: "fa-sun" },
            { value: "dark", label: "Dark", icon: "fa-moon" },
            { value: "auto", label: "Auto", icon: "fa-adjust" },
          ].map((theme) => (
            <label key={theme.value} className="relative">
              <input
                type="radio"
                name="theme"
                value={theme.value}
                checked={settings.theme === theme.value}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer text-center hover:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-50">
                <i
                  className={`fas ${theme.icon} text-2xl mb-2 ${
                    theme.value === "light"
                      ? "text-yellow-500"
                      : theme.value === "dark"
                      ? "text-gray-700"
                      : "text-gray-500"
                  }`}
                ></i>
                <p className="font-medium">{theme.label}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <select
            name="fontSize"
            value={settings.fontSize}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Density
          </label>
          <select
            name="density"
            value={settings.density}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <i className="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-yellow-800">Account Management</h4>
            <p className="text-sm text-yellow-700 mt-1">
              These actions are irreversible. Please proceed with caution.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Export Data</h4>
          <p className="text-sm text-gray-500 mb-3">
            Download all your data from this platform
          </p>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
            <i className="fas fa-download mr-2"></i> Export My Data
          </button>
        </div>

        <div className="p-4 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
          <p className="text-sm text-red-600 mb-3">
            This will permanently delete your account and all data
          </p>
          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            <i className="fas fa-trash mr-2"></i> Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Customize your application preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Settings Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition duration-150 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "general" && renderGeneralSettings()}
          {activeTab === "notifications" && renderNotificationSettings()}
          {activeTab === "privacy" && renderPrivacySettings()}
          {activeTab === "appearance" && renderAppearanceSettings()}
          {activeTab === "account" && renderAccountSettings()}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              Reset to Default
            </button>
            <div className="space-x-3">
              <button
                onClick={() => setActiveTab("general")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
