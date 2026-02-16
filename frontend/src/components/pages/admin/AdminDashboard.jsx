import { useMemo, memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// SVG Icon Components (no external dependencies)
const Icons = {
  Users: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  Project: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  ),

  Clock: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),

  Heartbeat: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),

  UserCog: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <circle cx="18" cy="11" r="3" />
      <path d="M18 8v1" />
      <path d="M18 14v-1" />
      <path d="M15.5 9.5l.9.4" />
      <path d="M19.6 12.1l.9.4" />
      <path d="M15.5 12.5l.9-.4" />
      <path d="M19.6 9.9l.9-.4" />
    </svg>
  ),

  Settings: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),

  Clipboard: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="12" y2="18" />
    </svg>
  ),

  Database: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
};

// Animated Counter Hook for stat values
const useAnimatedCounter = (endValue, duration = 1000) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(endValue) || 0;

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  return count;
};

// Stat Card Component - displays individual statistics with icon and animation
const StatCard = memo(
  ({
    icon: IconComponent,
    iconColorClass,
    bgColorClass,
    value,
    label,
    delay = 0,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const numericPart = parseInt(value) || 0;
    const suffix = value.toString().replace(/[0-9]/g, "");
    const animatedValue = useAnimatedCounter(isVisible ? numericPart : 0, 1200);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div
        className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-lg dark:hover:shadow-slate-700/50 cursor-pointer group ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center">
          <div
            className={`w-14 h-14 ${bgColorClass} rounded-xl flex items-center justify-center mr-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            <IconComponent
              className={`w-7 h-7 ${iconColorClass}`}
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {animatedValue}
              {suffix}
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">
              {label}
            </div>
          </div>
        </div>
        <div
          className={`h-1 mt-4 rounded-full ${bgColorClass} overflow-hidden`}
        >
          <div
            className={`h-full ${iconColorClass.replace("text-", "bg-")} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: isVisible ? "100%" : "0%" }}
          />
        </div>
      </div>
    );
  },
);

StatCard.displayName = "StatCard";

// Quick Action Button Component with enhanced hover effects
const QuickActionButton = memo(
  ({ icon: IconComponent, iconColorClass, bgColorClass, label, onClick }) => (
    <button
      onClick={onClick}
      className="group relative p-5 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-transparent text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-700/30"
      aria-label={label}
    >
      <div
        className={`absolute inset-0 ${bgColorClass || "bg-blue-50 dark:bg-blue-900/20"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative z-10">
        <div
          className={`${iconColorClass} flex justify-center mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1`}
        >
          <IconComponent className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="font-semibold text-slate-900 dark:text-white transition-colors">
          {label}
        </div>
      </div>
    </button>
  ),
);

QuickActionButton.displayName = "QuickActionButton";

// Activity Item Component with hover animation
const ActivityItem = memo(({ user, action, time, icon: IconComponent }) => (
  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
        {user.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-slate-900 dark:text-white">
          {user}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {action}
        </div>
      </div>
    </div>
    <time className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
      {time}
    </time>
  </div>
));

ActivityItem.displayName = "ActivityItem";

// Service Status Item Component with pulse animation
const ServiceStatusItem = memo(
  ({ service, status, uptime, icon: IconComponent }) => {
    const isOnline = status === "Online";

    return (
      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-4 h-4 rounded-full ${
                isOnline
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-rose-500 dark:bg-rose-400"
              }`}
              role="status"
              aria-label={`${service} is ${status}`}
            />
            {isOnline && (
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isOnline
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : "bg-rose-100 dark:bg-rose-900/30"
            }`}
          >
            {IconComponent && (
              <IconComponent
                className={`w-5 h-5 ${
                  isOnline
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {service}
            </div>
            <div
              className={`text-sm font-medium ${
                isOnline
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {status}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {uptime}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Uptime
          </div>
        </div>
      </div>
    );
  },
);

ServiceStatusItem.displayName = "ServiceStatusItem";

// Stats configuration for easy maintenance
const STATS_CONFIG = [
  {
    key: "totalUsers",
    icon: Icons.Users,
    iconColorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-100 dark:bg-blue-900/30",
    label: "Total Users",
  },
  {
    key: "activeProjects",
    icon: Icons.Project,
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    bgColorClass: "bg-emerald-100 dark:bg-emerald-900/30",
    label: "Active Projects",
  },
  {
    key: "pendingApprovals",
    icon: Icons.Clock,
    iconColorClass: "text-amber-600 dark:text-amber-400",
    bgColorClass: "bg-amber-100 dark:bg-amber-900/30",
    label: "Pending Approvals",
  },
  {
    key: "systemHealth",
    icon: Icons.Heartbeat,
    iconColorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-100 dark:bg-purple-900/30",
    label: "System Health",
    suffix: "%",
  },
];

// Quick actions configuration with correct route paths
const QUICK_ACTIONS_CONFIG = [
  {
    id: "users",
    icon: Icons.UserCog,
    iconColorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-50 dark:bg-blue-900/20",
    label: "User Management",
    path: "/user-management",
  },
  {
    id: "settings",
    icon: Icons.Settings,
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    bgColorClass: "bg-emerald-50 dark:bg-emerald-900/20",
    label: "System Settings",
    path: "/system-settings",
  },
  {
    id: "audit",
    icon: Icons.Clipboard,
    iconColorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-50 dark:bg-purple-900/20",
    label: "Audit Log",
    path: "/audit-log",
  },
  {
    id: "backup",
    icon: Icons.Database,
    iconColorClass: "text-amber-600 dark:text-amber-400",
    bgColorClass: "bg-amber-50 dark:bg-amber-900/20",
    label: "Backup",
    path: "/backup",
  },
];

// Service icons mapping
const SERVICE_ICONS = {
  db: Icons.Database,
  storage: Icons.Project,
  email: Icons.Clipboard,
  api: Icons.Settings,
};

const AdminDashboard = memo(() => {
  const navigate = useNavigate();
  const handleNavigate = useCallback((path) => () => navigate(path), [navigate]);

  // State for real dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    systemHealth: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optionally, keep static system services for now
  const systemServices = useMemo(
    () => [
      { id: "db", service: "Database", status: "Online", uptime: "99.9%" },
      { id: "storage", service: "File Storage", status: "Online", uptime: "99.8%" },
      { id: "email", service: "Email Service", status: "Online", uptime: "99.7%" },
      { id: "api", service: "API Server", status: "Online", uptime: "99.9%" },
    ],
    [],
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    analyticsService.getDashboardStats()
      .then((res) => {
        if (mounted && res && res.data) {
          setStats({
            totalUsers: res.data.totalUsers,
            activeProjects: res.data.activeProjects,
            pendingApprovals: res.data.pendingApprovals,
            systemHealth: res.data.systemHealth,
          });
          setRecentActivities(
            (res.data.recentActivities || []).map((a, idx) => ({
              id: idx + 1,
              user: a.owner?.name || "Unknown",
              action: `${a.status === "pending" ? "Pending approval for" : a.status === "active" ? "Active project:" : "Project updated:"} ${a.title}`,
              time: new Date(a.updatedAt).toLocaleString(),
            }))
          );
        }
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900" role="main">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner with Gradient */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome back, Admin!
                  </h1>
                  <p className="text-blue-100 text-sm md:text-base">
                    Everything is running smoothly. Here's your system overview.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-xs text-blue-100">System Uptime</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-emerald-300">
                  All OK
                </div>
                <div className="text-xs text-blue-100">Services Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <header className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            System Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor and manage your platform's key metrics
          </p>
        </header>

        {/* Stats Grid with staggered animations */}
        <section
          aria-label="Statistics Overview"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {STATS_CONFIG.map(
            (
              { key, icon, iconColorClass, bgColorClass, label, suffix },
              index,
            ) => (
              <StatCard
                key={key}
                icon={icon}
                iconColorClass={iconColorClass}
                bgColorClass={bgColorClass}
                value={`${stats[key]}${suffix || ""}`}
                label={label}
                delay={index * 100}
              />
            ),
          )}
        </section>

        {/* Admin Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <section
            aria-label="Quick Actions"
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                Admin Tools
              </span>
            </div>
            <nav
              className="grid grid-cols-2 gap-4"
              aria-label="Admin navigation"
            >
              {QUICK_ACTIONS_CONFIG.map(
                ({ id, icon, iconColorClass, bgColorClass, label, path }) => (
                  <QuickActionButton
                    key={id}
                    icon={icon}
                    iconColorClass={iconColorClass}
                    bgColorClass={bgColorClass}
                    label={label}
                    onClick={handleNavigate(path)}
                  />
                ),
              )}
            </nav>
          </section>

          {/* Recent Activities */}
          <section
            aria-label="Recent Activities"
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activities
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                <span style={{ textDecoration: "none" }}>View All</span>
              </button>
            </div>
            <div className="space-y-3" role="list" aria-label="Activity list">
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
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                System Status
              </h2>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                All Systems Operational
              </span>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              <span style={{ textDecoration: "none" }}>View Details</span>
            </button>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            role="list"
            aria-label="Service status list"
          >
            {systemServices.map((service) => (
              <ServiceStatusItem
                key={service.id}
                service={service.service}
                status={service.status}
                uptime={service.uptime}
                icon={SERVICE_ICONS[service.id]}
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
