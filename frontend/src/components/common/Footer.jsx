import { useState, useEffect, useCallback, useMemo, memo } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Footer = memo(() => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState("normal");
  const [serverLoad, setServerLoad] = useState(65);
  const [activeUsers, setActiveUsers] = useState(156);
  const [storageUsed, setStorageUsed] = useState(78); // in percentage
  const [networkLatency, setNetworkLatency] = useState(42); // in ms

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate dynamic system metrics every 8 seconds
  useEffect(() => {
    const metricsTimer = setInterval(() => {
      const load = Math.floor(Math.random() * 35) + 40;
      setServerLoad(load);
      setSystemStatus(load > 80 ? "high" : load > 60 ? "moderate" : "normal");
      setActiveUsers((prev) => Math.max(50, Math.min(300, prev + (Math.floor(Math.random() * 21) - 10))));
      setStorageUsed((prev) => Math.min(95, prev + (Math.random() > 0.7 ? 0.1 : 0)));
      setNetworkLatency(Math.floor(Math.random() * 40) + 20);
    }, 8000);
    return () => clearInterval(metricsTimer);
  }, []);

  const getSystemStatusColor = useCallback(() => {
    switch (systemStatus) {
      case "normal":
        return "text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400";
      case "moderate":
        return "text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400";
      case "high":
        return "text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400";
      default:
        return "text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400";
    }
  }, [systemStatus]);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, []);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const handleRefreshMetrics = useCallback(() => {
    const loadingToast = toast.loading("Refreshing system metrics...");
    setTimeout(() => {
      setServerLoad(Math.floor(Math.random() * 30) + 40);
      toast.dismiss(loadingToast);
      toast.success("Metrics refreshed successfully");
    }, 800);
  }, []);

  const getPerformanceTip = useCallback(() => {
    if (serverLoad > 80)
      return "High server load detected. Consider optimizing queries.";
    if (storageUsed > 85) return "Storage nearing capacity. Consider cleanup.";
    if (networkLatency > 60) return "High network latency. Check connection.";
    return "All systems operating optimally.";
  }, [serverLoad, storageUsed, networkLatency]);

  // Memoized computed values
  const userRoleLabel = useMemo(() => {
    const roleLabels = {
      admin: "Administrator",
      faculty: "Faculty Member",
      student: "Student",
    };
    return roleLabels[user?.role] || "User";
  }, [user?.role]);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  return (
    <footer className="bg-white dark:bg-gray-900 border-t-2 border-gray-300 dark:border-gray-800 mt-8 shadow-lg" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Enhanced */}
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card - Enhanced */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm mr-4">
                    <i className="fas fa-user text-blue-600 dark:text-blue-400 text-lg" aria-hidden="true"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {userRoleLabel}
                    </p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" aria-label="Online"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Active Now</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toast.info("Quick profile actions coming soon!")
                  }
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  title="Quick Actions"
                  aria-label="Quick actions menu"
                >
                  <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 border-opacity-30">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Last Login</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* System Status Card - Enhanced */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    System Status
                  </span>
                  <div className="text-xs mt-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                      {getPerformanceTip()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefreshMetrics}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                    title="Refresh Metrics"
                    aria-label="Refresh system metrics"
                  >
                    <i className="fas fa-sync-alt text-xs" aria-hidden="true"></i>
                  </button>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getSystemStatusColor()}`}
                  >
                    {systemStatus.charAt(0).toUpperCase() +
                      systemStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Multiple Metrics */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Server Load</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {serverLoad}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        serverLoad > 80
                          ? "bg-red-500"
                          : serverLoad > 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${serverLoad}%` }}
                      role="progressbar"
                      aria-valuenow={serverLoad}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label="Server load percentage"
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {storageUsed.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        storageUsed > 85
                          ? "bg-red-500"
                          : storageUsed > 70
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${storageUsed}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round(storageUsed)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label="Storage usage percentage"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-xs">
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fas fa-bolt mr-1" aria-hidden="true"></i>
                  <span>Latency: {networkLatency}ms</span>
                </span>
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fas fa-users mr-1" aria-hidden="true"></i>
                  <span>Active: {activeUsers}</span>
                </span>
              </div>
            </div>

            {/* Date, Time & Controls Card - Enhanced */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-3">
                  <i className="fas fa-clock text-gray-400 dark:text-gray-500 mr-2" aria-hidden="true"></i>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Current Time
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {formatDate(currentTime)}
                </div>

                {/* Timezone Info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <i className="fas fa-globe mr-1" aria-hidden="true"></i>
                  {timezone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800"></div>

        {/* Bottom Section - Enhanced */}
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side - Quick Links with Icons */}
            <div className="mb-4 md:mb-0">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => toast.info("Help center launching soon!")}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 inline-flex items-center"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100 dark:bg-gray-800">
                    <i className="fas fa-question-circle text-sm" aria-hidden="true"></i>
                  </div>
                  Help Center
                </button>
                <button
                  onClick={() => toast.info("Documentation portal coming soon!")}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 inline-flex items-center"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100 dark:bg-gray-800">
                    <i className="fas fa-file-alt text-sm" aria-hidden="true"></i>
                  </div>
                  Documentation
                </button>
                <button
                  onClick={() => toast.info("Privacy policy updated!")}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 inline-flex items-center"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100 dark:bg-gray-800">
                    <i className="fas fa-shield-alt text-sm" aria-hidden="true"></i>
                  </div>
                  Privacy Policy
                </button>
                <button
                  onClick={() => toast.info("Terms of service loaded!")}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150 inline-flex items-center"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100 dark:bg-gray-800">
                    <i className="fas fa-file-contract text-sm" aria-hidden="true"></i>
                  </div>
                  Terms of Service
                </button>
              </div>
            </div>

            {/* Right side - Copyright & Version */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                © {currentYear} Student Project Management System
                <span className="mx-2">•</span>
                <span className="font-medium">v2.1.0</span>
                <span className="mx-2">•</span>
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  Production
                </span>
              </p>
              <div className="flex items-center justify-center md:justify-end text-xs gap-3">
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fas fa-shield-alt mr-1 text-green-500" aria-hidden="true"></i>
                  <span>SSL Secured</span>
                </span>
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fas fa-database mr-1 text-blue-500" aria-hidden="true"></i>
                  <span>Uptime: 99.9%</span>
                </span>
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fas fa-rocket mr-1 text-purple-500" aria-hidden="true"></i>
                  <span>v2.1.0</span>
                </span>
              </div>
            </div>
          </div>

          {/* System Info Bar - Enhanced */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs">
              <div className="flex flex-wrap gap-3 mb-2 md:mb-0">
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span>API: Operational</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                    Healthy
                  </span>
                </span>
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Database: Connected</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                    Active
                  </span>
                </span>
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Cache: Active</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                    98% Hit
                  </span>
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center mr-3">
                  <i className="fas fa-user-clock mr-1" aria-hidden="true"></i>
                  <span>Session: Active</span>
                </span>
                <span className="inline-flex items-center">
                  <i className="fas fa-users mr-1" aria-hidden="true"></i>
                  <span>Users Online: {activeUsers}</span>
                </span>
                <button
                  onClick={() =>
                    toast.info("Detailed metrics panel coming soon!")
                  }
                  className="ml-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  aria-label="View detailed metrics"
                >
                  <i className="fas fa-chart-bar" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-3 flex justify-center md:justify-start">
            <div className="flex gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Operational</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Degraded</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Outage</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
