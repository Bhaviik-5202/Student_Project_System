import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BackupRestore = memo(() => {
  const navigate = useNavigate();
  const backups = useMemo(
    () => [
      {
        id: 1,
        name: "Backup_2024-01-15",
        type: "Full",
        size: "2.4 GB",
        date: "2024-01-15 02:00:00",
        status: "Completed",
      },
      {
        id: 2,
        name: "Backup_2024-01-14",
        type: "Incremental",
        size: "450 MB",
        date: "2024-01-14 02:00:00",
        status: "Completed",
      },
      {
        id: 3,
        name: "Backup_2024-01-13",
        type: "Full",
        size: "2.3 GB",
        date: "2024-01-13 02:00:00",
        status: "Completed",
      },
      {
        id: 4,
        name: "Backup_2024-01-12",
        type: "Incremental",
        size: "520 MB",
        date: "2024-01-12 02:00:00",
        status: "Completed",
      },
    ],
    []
  );

  const [backupType, setBackupType] = useState("full");
  const [loading, setLoading] = useState(false);

  const handleBackup = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      toast.success(
        `${
          backupType === "full" ? "Full" : "Incremental"
        } backup initiated successfully`
      );
      setLoading(false);
    }, 2000);
  }, [backupType]);

  const handleRestore = useCallback((backupId) => {
    toast.success(`Restore process initiated for backup ${backupId}`);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Backup & Restore
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage system backups and restoration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Create Backup Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Create Backup
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Backup Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBackupType("full")}
                    className={`px-4 py-3 rounded-lg border text-center transition-colors ${
                      backupType === "full"
                        ? "border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-medium">Full Backup</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Complete system backup
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBackupType("incremental")}
                    className={`px-4 py-3 rounded-lg border text-center transition-colors ${
                      backupType === "incremental"
                        ? "border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-medium">Incremental</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Backup changes only
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Include Data
                </label>
                <div className="space-y-2">
                  {[
                    "User Data",
                    "Project Files",
                    "Database",
                    "System Logs",
                    "Configuration",
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                      />
                      <span className="ml-2 text-slate-700 dark:text-slate-300">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBackup}
                disabled={loading}
                className="w-full px-4 py-3 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Backup...
                  </div>
                ) : (
                  `Create ${
                    backupType === "full" ? "Full" : "Incremental"
                  } Backup`
                )}
              </button>
            </div>
          </div>

          {/* Backup List */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Available Backups
            </h3>
            <div className="space-y-4">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {backup.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {backup.type} • {backup.size} • {backup.date}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(backup.id)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    >
                      Restore
                    </button>
                    <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Backup Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Backup Schedule
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600">
                <option>Daily at 2:00 AM</option>
                <option>Weekly on Sunday</option>
                <option>Monthly on 1st</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Retention Period
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600">
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Storage Location
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600">
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

BackupRestore.displayName = "BackupRestore";

export default BackupRestore;
