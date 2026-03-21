import { useState, useCallback, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";
import "../../../assets/styles/admin.css";

const SystemSettings = memo(() => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    systemName: "",
    maintenanceMode: false,
    emailNotifications: false,
    fileUploadLimit: 0,
    sessionTimeout: 0,
    backupFrequency: "daily",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put("/admin/settings", settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  }, [settings]);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h1 className="admin-title">System Settings</h1>
            <p className="admin-subtitle">Global configuration and platform preferences</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="admin-btn admin-btn-primary"
          >
            {loading ? "Saving..." : "Save All Changes"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="admin-card">
              <h3 className="text-lg font-bold mb-6">General Configuration</h3>
              <div className="space-y-6">
                <div className="admin-form-group">
                  <label className="admin-label">System Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.systemName}
                    onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                    placeholder="e.g. Student Project Management System"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Maintenance Mode</div>
                    <div className="text-sm text-slate-500">Temporarily disable public access to the system</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.maintenanceMode ? "bg-rose-500" : "bg-slate-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </section>

            <section className="admin-card">
              <h3 className="text-lg font-bold mb-6">System Limits & Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="admin-form-group">
                  <label className="admin-label">File Upload Limit (MB)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={settings.fileUploadLimit}
                    onChange={(e) => setSettings({ ...settings, fileUploadLimit: parseInt(e.target.value) })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Maximum size allowed for document uploads</p>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Session Timeout (min)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Automatic logout after inactivity</p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="admin-card">
              <h3 className="text-lg font-bold mb-6">Backup & Recovery</h3>
              <div className="admin-form-group">
                <label className="admin-label">Backup Frequency</label>
                <select
                  className="admin-input"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button className="w-full mt-4 admin-btn admin-btn-secondary text-sm">
                Run Manual Backup Now
              </button>
            </section>

            <section className="admin-card">
              <h3 className="text-lg font-bold mb-6">Notifications</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Email Notifications</div>
                  <div className="text-xs text-slate-500">Alert admins on critical events</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.emailNotifications ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
});

SystemSettings.displayName = "SystemSettings";

export default SystemSettings;
