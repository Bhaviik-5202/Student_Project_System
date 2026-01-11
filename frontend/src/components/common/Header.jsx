import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock count
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New project assigned",
      time: "5 min ago",
      read: false,
      icon: "fa-project-diagram",
    },
    {
      id: 2,
      title: "Deadline approaching",
      time: "1 hour ago",
      read: false,
      icon: "fa-calendar-alt",
    },
    {
      id: 3,
      title: "Weekly report ready",
      time: "2 hours ago",
      read: true,
      icon: "fa-chart-bar",
    },
    {
      id: 4,
      title: "System update",
      time: "1 day ago",
      read: true,
      icon: "fa-sync",
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const handleMarkAllAsRead = () => {
    setUnreadNotifications(0);
    setShowNotifications(false);
  };

  const getRoleLabel = () => {
    const roles = {
      admin: "Administrator Dashboard",
      faculty: "Faculty Dashboard",
      student: "Student Dashboard",
      coordinator: "Coordinator Dashboard",
    };
    return roles[user?.role] || "Dashboard";
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
                  <i className="fas fa-graduation-cap text-white text-lg"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  Project Management System
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {getRoleLabel()}
                </p>
              </div>
            </div>

            {/* Breadcrumb (Desktop only) */}
            <div className="hidden lg:block ml-6 pl-6 border-l border-gray-200">
              <nav className="flex items-center space-x-2 text-sm">
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-primary-600"
                >
                  <i className="fas fa-home"></i>
                </Link>
                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                <span className="text-gray-700 font-medium capitalize">
                  {location.pathname.split("/").pop() || "Dashboard"}
                </span>
              </nav>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Search (Desktop only) */}
            <div className="hidden md:block relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 text-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <i className="fas fa-bell text-xl"></i>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-xs font-bold text-white">
                      {unreadNotifications}
                    </span>
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                      {unreadNotifications > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${
                          notification.read
                            ? "border-transparent"
                            : "border-primary-500"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              notification.read
                                ? "bg-gray-100"
                                : "bg-primary-50"
                            }`}
                          >
                            <i
                              className={`fas ${notification.icon} ${
                                notification.read
                                  ? "text-gray-500"
                                  : "text-primary-600"
                              }`}
                            ></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 px-4 py-3">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center block w-full"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
                <i
                  className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
                    showUserMenu ? "transform rotate-180" : ""
                  }`}
                ></i>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded-full capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    >
                      <i className="fas fa-tachometer-alt w-5 mr-3 text-gray-400"></i>
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    >
                      <i className="fas fa-user w-5 mr-3 text-gray-400"></i>
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    >
                      <i className="fas fa-cog w-5 mr-3 text-gray-400"></i>
                      Settings
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                      >
                        <i className="fas fa-shield-alt w-5 mr-3 text-gray-400"></i>
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-2"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
