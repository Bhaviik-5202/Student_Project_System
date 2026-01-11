import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState("normal");
  const [serverLoad, setServerLoad] = useState(65);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate system status changes
    const statusTimer = setInterval(() => {
      const load = Math.floor(Math.random() * 30) + 40;
      setServerLoad(load);
      setSystemStatus(load > 80 ? "high" : load > 60 ? "moderate" : "normal");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case "normal":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-green-600 bg-green-100";
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

  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mr-4">
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
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status Card */}
            <div className="bg-gradient-to-br from-secondary-50 to-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">
                  System Status
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getSystemStatusColor()}`}
                >
                  {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
                </span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Server Load</span>
                  <span>{serverLoad}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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
              <div className="flex items-center text-xs text-gray-500">
                <i className="fas fa-server mr-2"></i>
                <span>Last updated: Just now</span>
              </div>
            </div>

            {/* Date & Time Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <i className="fas fa-clock text-gray-400 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">
                    Current Time
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Bottom Section */}
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side - Quick Links */}
            <div className="mb-4 md:mb-0">
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150"
                >
                  <i className="fas fa-question-circle mr-1"></i> Help Center
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150"
                >
                  <i className="fas fa-file-alt mr-1"></i> Documentation
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150"
                >
                  <i className="fas fa-shield-alt mr-1"></i> Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-primary-600 transition duration-150"
                >
                  <i className="fas fa-file-contract mr-1"></i> Terms of Service
                </a>
              </div>
            </div>

            {/* Right side - Copyright & Version */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-1">
                © {new Date().getFullYear()} Student Project Management System
                v2.1.0
              </p>
              <div className="flex items-center justify-center md:justify-end text-xs text-gray-500">
                <span className="inline-flex items-center mr-3">
                  <i className="fas fa-shield-alt mr-1"></i>
                  <span>SSL Secured</span>
                </span>
                <span className="inline-flex items-center">
                  <i className="fas fa-database mr-1"></i>
                  <span>Uptime: 99.9%</span>
                </span>
              </div>
            </div>
          </div>

          {/* System Info Bar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
              <div className="flex flex-wrap gap-3 mb-2 md:mb-0">
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>API: Operational</span>
                </span>
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>Database: Connected</span>
                </span>
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>Cache: Active</span>
                </span>
              </div>
              <div className="text-xs">
                <span>Session: Active • </span>
                <span>Users Online: 156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
