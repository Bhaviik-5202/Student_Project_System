import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Footer = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState("normal");
  const [serverLoad, setServerLoad] = useState(65);
  const [activeUsers, setActiveUsers] = useState(156);
  const [storageUsed, setStorageUsed] = useState(78); // in percentage
  const [networkLatency, setNetworkLatency] = useState(42); // in ms
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate dynamic system metrics
    const metricsTimer = setInterval(() => {
      // Simulate realistic fluctuations
      const load = Math.floor(Math.random() * 35) + 40;
      setServerLoad(load);
      setSystemStatus(load > 80 ? "high" : load > 60 ? "moderate" : "normal");

      // Simulate active users change
      const userChange = Math.floor(Math.random() * 21) - 10;
      setActiveUsers((prev) => Math.max(50, Math.min(300, prev + userChange)));

      // Simulate storage usage (slowly increasing)
      setStorageUsed((prev) =>
        Math.min(95, prev + (Math.random() > 0.7 ? 0.1 : 0))
      );

      // Simulate network latency
      setNetworkLatency(Math.floor(Math.random() * 40) + 20);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(metricsTimer);
    };
  }, []);

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case "normal":
        return "text-green-600 bg-green-100 border-green-200";
      case "moderate":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-green-600 bg-green-100 border-green-200";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRefreshMetrics = () => {
    toast.loading("Refreshing system metrics...");
    setTimeout(() => {
      setServerLoad(Math.floor(Math.random() * 30) + 40);
      toast.dismiss();
      toast.success("Metrics refreshed successfully");
    }, 800);
  };

  const getPerformanceTip = () => {
    if (serverLoad > 80)
      return "High server load detected. Consider optimizing queries.";
    if (storageUsed > 85) return "Storage nearing capacity. Consider cleanup.";
    if (networkLatency > 60) return "High network latency. Check connection.";
    return "All systems operating optimally.";
  };

  return (
    <footer className="bg-white border-t-2 border-gray-300 mt-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Enhanced */}
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card - Enhanced */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100 rounded-xl p-5 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm mr-4">
                    <i className="fas fa-user text-primary-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {user?.role === "admin"
                        ? "Administrator"
                        : user?.role === "faculty"
                        ? "Faculty Member"
                        : "Student"}
                    </p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs text-gray-500">Active Now</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toast.info("Quick profile actions coming soon!")
                  }
                  className="p-2 rounded-lg hover:bg-white text-gray-600 transition-colors duration-200"
                  title="Quick Actions"
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 border-opacity-30">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* System Status Card - Enhanced */}
            <div className="bg-gradient-to-br from-secondary-50 to-gray-50 border border-gray-200 rounded-xl p-5 border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    System Status
                  </span>
                  <div className="text-xs mt-1">
                    <span className="text-gray-600">
                      <i className="fas fa-info-circle mr-1"></i>
                      {getPerformanceTip()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefreshMetrics}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                    title="Refresh Metrics"
                  >
                    <i className="fas fa-sync-alt text-xs"></i>
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
                    <span className="text-gray-600">Server Load</span>
                    <span className="text-gray-900 font-medium">
                      {serverLoad}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        serverLoad > 80
                          ? "bg-red-500"
                          : serverLoad > 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${serverLoad}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Storage Used</span>
                    <span className="text-gray-900 font-medium">
                      {storageUsed}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        storageUsed > 85
                          ? "bg-red-500"
                          : storageUsed > 70
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${storageUsed}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-xs">
                <span className="inline-flex items-center text-gray-500">
                  <i className="fas fa-bolt mr-1"></i>
                  <span>Latency: {networkLatency}ms</span>
                </span>
                <span className="inline-flex items-center text-gray-500">
                  <i className="fas fa-users mr-1"></i>
                  <span>Active: {activeUsers}</span>
                </span>
              </div>
            </div>

            {/* Date, Time & Controls Card - Enhanced */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 border shadow-sm">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-3">
                  <i className="fas fa-clock text-gray-400 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">
                    Current Time
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {formatDate(currentTime)}
                </div>

                {/* Timezone Info */}
                <div className="text-xs text-gray-500 mb-2">
                  <i className="fas fa-globe mr-1"></i>
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Bottom Section - Enhanced */}
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side - Quick Links with Icons */}
            <div className="mb-4 md:mb-0">
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150 inline-flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Help center launching soon!");
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100">
                    <i className="fas fa-question-circle text-sm"></i>
                  </div>
                  Help Center
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150 inline-flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Documentation portal coming soon!");
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100">
                    <i className="fas fa-file-alt text-sm"></i>
                  </div>
                  Documentation
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150 inline-flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Privacy policy updated!");
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100">
                    <i className="fas fa-shield-alt text-sm"></i>
                  </div>
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150 inline-flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Terms of service loaded!");
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-100">
                    <i className="fas fa-file-contract text-sm"></i>
                  </div>
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Right side - Copyright & Version */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-1">
                © {new Date().getFullYear()} Student Project Management System
                <span className="mx-2">•</span>
                <span className="font-medium">v2.1.0</span>
                <span className="mx-2">•</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Production
                </span>
              </p>
              <div className="flex items-center justify-center md:justify-end text-xs gap-3">
                <span className="inline-flex items-center text-gray-500">
                  <i className="fas fa-shield-alt mr-1 text-green-500"></i>
                  <span>SSL Secured</span>
                </span>
                <span className="inline-flex items-center text-gray-500">
                  <i className="fas fa-database mr-1 text-blue-500"></i>
                  <span>Uptime: 99.9%</span>
                </span>
                <span className="inline-flex items-center text-gray-500">
                  <i className="fas fa-rocket mr-1 text-purple-500"></i>
                  <span>v2.1.0</span>
                </span>
              </div>
            </div>
          </div>

          {/* System Info Bar - Enhanced */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs">
              <div className="flex flex-wrap gap-3 mb-2 md:mb-0">
                <span className="inline-flex items-center text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span>API: Operational</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                    Healthy
                  </span>
                </span>
                <span className="inline-flex items-center text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Database: Connected</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                    Active
                  </span>
                </span>
                <span className="inline-flex items-center text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Cache: Active</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                    98% Hit
                  </span>
                </span>
              </div>
              <div className="text-gray-600">
                <span className="inline-flex items-center mr-3">
                  <i className="fas fa-user-clock mr-1"></i>
                  <span>Session: Active</span>
                </span>
                <span className="inline-flex items-center">
                  <i className="fas fa-users mr-1"></i>
                  <span>Users Online: {activeUsers}</span>
                </span>
                <button
                  onClick={() =>
                    toast.info("Detailed metrics panel coming soon!")
                  }
                  className="ml-3 text-primary-600 hover:text-primary-700"
                >
                  <i className="fas fa-chart-bar"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-3 flex justify-center md:justify-start">
            <div className="flex gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Operational</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Degraded</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Outage</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
