import { useMemo, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Stat Card Component - displays individual statistics with icon
const StatCard = memo(({ icon, iconColorClass, bgColorClass, value, label }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
    <div className="flex items-center">
      <div className={`w-12 h-12 ${bgColorClass} rounded-lg flex items-center justify-center mr-4`}>
        <i className={`fas ${icon} text-xl ${iconColorClass}`} aria-hidden="true"></i>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        <div className="text-slate-600 dark:text-slate-400">{label}</div>
      </div>
    </div>
  </div>
));

StatCard.displayName = "StatCard";

// Quick Action Button Component
const QuickActionButton = memo(({ icon, iconColorClass, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
    aria-label={label}
  >
    <div className={`${iconColorClass} text-lg mb-2`}>
      <i className={`fas ${icon}`} aria-hidden="true"></i>
    </div>
    <div className="font-medium text-slate-900 dark:text-white">{label}</div>
  </button>
));

QuickActionButton.displayName = "QuickActionButton";

// Activity Item Component
const ActivityItem = memo(({ user, action, time }) => (
  <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
    <div>
      <div className="font-medium text-slate-900 dark:text-white">{user}</div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{action}</div>
    </div>
    <time className="text-sm text-slate-500 dark:text-slate-400">{time}</time>
  </div>
));

ActivityItem.displayName = "ActivityItem";

// Service Status Item Component
const ServiceStatusItem = memo(({ service, status, uptime }) => {
  const isOnline = status === "Online";
  
  return (
    <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full mr-3 ${
            isOnline ? "bg-emerald-500 dark:bg-emerald-400" : "bg-rose-500 dark:bg-rose-400"
          }`}
          role="status"
          aria-label={`${service} is ${status}`}
        ></div>
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{service}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{status}</div>
        </div>
      </div>
      <div className="text-slate-900 dark:text-white font-medium">{uptime}</div>
    </div>
  );
});

ServiceStatusItem.displayName = "ServiceStatusItem";

// Stats configuration for easy maintenance
const STATS_CONFIG = [
  {
    key: "totalUsers",
    icon: "fa-users",
    iconColorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-100 dark:bg-blue-900/30",
    label: "Total Users",
  },
  {
    key: "activeProjects",
    icon: "fa-project-diagram",
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    bgColorClass: "bg-emerald-100 dark:bg-emerald-900/30",
    label: "Active Projects",
  },
  {
    key: "pendingApprovals",
    icon: "fa-clock",
    iconColorClass: "text-amber-600 dark:text-amber-400",
    bgColorClass: "bg-amber-100 dark:bg-amber-900/30",
    label: "Pending Approvals",
  },
  {
    key: "systemHealth",
    icon: "fa-heartbeat",
    iconColorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-100 dark:bg-purple-900/30",
    label: "System Health",
    suffix: "%",
  },
];

// Quick actions configuration
const QUICK_ACTIONS_CONFIG = [
  {
    id: "users",
    icon: "fa-user-cog",
    iconColorClass: "text-blue-600 dark:text-blue-400",
    label: "User Management",
    path: "/admin/users",
  },
  {
    id: "settings",
    icon: "fa-cogs",
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    label: "System Settings",
    path: "/admin/settings",
  },
  {
    id: "audit",
    icon: "fa-clipboard-list",
    iconColorClass: "text-purple-600 dark:text-purple-400",
    label: "Audit Log",
    path: "/admin/audit",
  },
  {
    id: "backup",
    icon: "fa-database",
    iconColorClass: "text-amber-600 dark:text-amber-400",
    label: "Backup",
    path: "/admin/backup",
  },
];

const AdminDashboard = memo(() => {
  const navigate = useNavigate();

  // Navigation handler with useCallback for performance
  const handleNavigate = useCallback(
    (path) => () => navigate(path),
    [navigate]
  );

  // Stats data - could be fetched from API in real implementation
  const stats = useMemo(
    () => ({
      totalUsers: 156,
      activeProjects: 48,
      pendingApprovals: 7,
      systemHealth: 95,
    }),
    []
  );

  // Recent activities data - could be fetched from API
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

  // System services data - could be fetched from API
  const systemServices = useMemo(
    () => [
      { id: "db", service: "Database", status: "Online", uptime: "99.9%" },
      { id: "storage", service: "File Storage", status: "Online", uptime: "99.8%" },
      { id: "email", service: "Email Service", status: "Online", uptime: "99.7%" },
      { id: "api", service: "API Server", status: "Online", uptime: "99.9%" },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900" role="main">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            System overview and administration controls
          </p>
        </header>

        {/* Stats Grid */}
        <section aria-label="Statistics Overview" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STATS_CONFIG.map(({ key, icon, iconColorClass, bgColorClass, label, suffix }) => (
            <StatCard
              key={key}
              icon={icon}
              iconColorClass={iconColorClass}
              bgColorClass={bgColorClass}
              value={`${stats[key]}${suffix || ""}`}
              label={label}
            />
          ))}
        </section>

        {/* Admin Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <section
            aria-label="Quick Actions"
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <nav className="grid grid-cols-2 gap-4" aria-label="Admin navigation">
              {QUICK_ACTIONS_CONFIG.map(({ id, icon, iconColorClass, label, path }) => (
                <QuickActionButton
                  key={id}
                  icon={icon}
                  iconColorClass={iconColorClass}
                  label={label}
                  onClick={handleNavigate(path)}
                />
              ))}
            </nav>
          </section>

          {/* Recent Activities */}
          <section
            aria-label="Recent Activities"
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Activities
            </h2>
            <div className="space-y-4" role="list" aria-label="Activity list">
              {recentActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  user={activity.user}
                  action={activity.action}
                  time={activity.time}
                />
              ))}
            </div>
          </section>
        </div>

        {/* System Status */}
        <section
          aria-label="System Status"
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            System Status
          </h2>
          <div className="space-y-4" role="list" aria-label="Service status list">
            {systemServices.map((service) => (
              <ServiceStatusItem
                key={service.id}
                service={service.service}
                status={service.status}
                uptime={service.uptime}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
});

AdminDashboard.displayName = "AdminDashboard";

export default AdminDashboard;
