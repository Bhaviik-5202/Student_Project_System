import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = memo(() => {
  const navigate = useNavigate();
  const stats = useMemo(
    () => ({
      totalUsers: 156,
      activeProjects: 48,
      pendingApprovals: 7,
      systemHealth: 95,
    }),
    []
  );

  const recentActivities = useMemo(
    () => [
    {
      id: 1,
      user: "John Doe",
      action: "Created new project",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Admin",
      action: "Updated system settings",
      time: "5 hours ago",
    },
    {
      id: 3,
      user: "Jane Smith",
      action: "Submitted project proposal",
      time: "1 day ago",
    },
    {
      id: 4,
      user: "System",
      action: "Automatic backup completed",
      time: "2 days ago",
    },
  ],
  []
);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            System overview and administration controls
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-users text-xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalUsers}
                </div>
                <div className="text-slate-600 dark:text-slate-400">Total Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-project-diagram text-xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.activeProjects}
                </div>
                <div className="text-slate-600 dark:text-slate-400">Active Projects</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-clock text-xl text-amber-600 dark:text-amber-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.pendingApprovals}
                </div>
                <div className="text-slate-600 dark:text-slate-400">Pending Approvals</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-heartbeat text-xl text-purple-600 dark:text-purple-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.systemHealth}%
                </div>
                <div className="text-slate-600 dark:text-slate-400">System Health</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/admin/users")}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-center transition-colors"
              >
                <div className="text-blue-600 dark:text-blue-400 text-lg mb-2">
                  <i className="fas fa-user-cog"></i>
                </div>
                <div className="font-medium text-slate-900 dark:text-white">User Management</div>
              </button>
              <button
                onClick={() => navigate("/admin/settings")}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-center transition-colors"
              >
                <div className="text-emerald-600 dark:text-emerald-400 text-lg mb-2">
                  <i className="fas fa-cogs"></i>
                </div>
                <div className="font-medium text-slate-900 dark:text-white">System Settings</div>
              </button>
              <button
                onClick={() => navigate("/admin/audit")}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-center transition-colors"
              >
                <div className="text-purple-600 dark:text-purple-400 text-lg mb-2">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <div className="font-medium text-slate-900 dark:text-white">Audit Log</div>
              </button>
              <button
                onClick={() => navigate("/admin/backup")}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-center transition-colors"
              >
                <div className="text-amber-600 dark:text-amber-400 text-lg mb-2">
                  <i className="fas fa-database"></i>
                </div>
                <div className="font-medium text-slate-900 dark:text-white">Backup</div>
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {activity.user}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.action}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            System Status
          </h3>
          <div className="space-y-4">
            {[
              { service: "Database", status: "Online", uptime: "99.9%" },
              { service: "File Storage", status: "Online", uptime: "99.8%" },
              { service: "Email Service", status: "Online", uptime: "99.7%" },
              { service: "API Server", status: "Online", uptime: "99.9%" },
            ].map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      service.status === "Online"
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : "bg-rose-500 dark:bg-rose-400"
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {service.service}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {service.status}
                    </div>
                  </div>
                </div>
                <div className="text-slate-900 dark:text-white font-medium">
                  {service.uptime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

AdminDashboard.displayName = "AdminDashboard";

export default AdminDashboard;
