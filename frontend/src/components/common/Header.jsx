import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = ({
  isScrolled,
  notificationCount,
  clearNotifications,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New project assigned",
      time: "5 min ago",
      read: false,
      icon: "fa-project-diagram",
      color: "text-blue-500 bg-blue-50",
    },
    {
      id: 2,
      title: "Deadline approaching",
      time: "1 hour ago",
      read: false,
      icon: "fa-calendar-alt",
      color: "text-red-500 bg-red-50",
    },
    {
      id: 3,
      title: "Weekly report ready",
      time: "2 hours ago",
      read: true,
      icon: "fa-chart-bar",
      color: "text-green-500 bg-green-50",
    },
    {
      id: 4,
      title: "System update completed",
      time: "1 day ago",
      read: true,
      icon: "fa-sync",
      color: "text-purple-500 bg-purple-50",
    },
  ];

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
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
        setShowSearch(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  // Focus search on Ctrl+K
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleMarkAllAsRead = () => {
    clearNotifications();
    setShowNotifications(false);
  };

  const getRoleLabel = () => {
    const roles = {
      admin: "Administrator",
      faculty: "Faculty Member",
      student: "Student",
    };
    return roles[user?.role] || "User";
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    if (!path) return "Dashboard";

    const titles = {
      dashboard: "Dashboard",
      projects: "Projects",
      students: "Students",
      meetings: "Meetings",
      reports: "Reports",
      profile: "Profile",
      settings: "Settings",
      admin: "Admin Panel",
      faculty: "Faculty Panel",
    };

    return (
      titles[path] ||
      path.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="h-16 px-4 md:px-6">
        <div className="flex justify-between items-center h-full">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  Project Management
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {getPageTitle()}
                </p>
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="md:hidden">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white"></i>
                </div>
                <span className="font-bold text-gray-900 text-sm">PMS</span>
              </div>
            </div>
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xl mx-8" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, students, meetings..."
                  className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs font-sans bg-gray-200 text-gray-600 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
              aria-label="Search"
            >
              <i className="fas fa-search"></i>
            </button>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                title="Quick Add"
              >
                <i className="fas fa-plus"></i>
              </button>
              <button
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                title="Calendar"
              >
                <i className="fas fa-calendar-alt"></i>
              </button>
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
                <i className="fas fa-bell text-lg"></i>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-xs font-bold text-white">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200 animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <div className="flex items-center space-x-2">
                        {notificationCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                        <Link
                          to="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
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
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${notification.color.split(" ")[1]}`}
                          >
                            <i
                              className={`fas ${notification.icon} ${notification.color.split(" ")[0]} text-sm`}
                            ></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
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
                    <div className="text-center text-xs text-gray-500">
                      {notifications.length} total notifications
                    </div>
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
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
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
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">
                    {getRoleLabel()}
                  </p>
                </div>
                <i
                  className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
                    showUserMenu ? "transform rotate-180" : ""
                  } hidden lg:block`}
                ></i>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200 animate-slide-down">
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
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded-full capitalize">
                          {user?.role || "user"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 group"
                    >
                      <i className="fas fa-tachometer-alt w-5 mr-3 text-gray-400 group-hover:text-primary-600"></i>
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 group"
                    >
                      <i className="fas fa-user w-5 mr-3 text-gray-400 group-hover:text-primary-600"></i>
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 group"
                    >
                      <i className="fas fa-cog w-5 mr-3 text-gray-400 group-hover:text-primary-600"></i>
                      Settings
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 group"
                      >
                        <i className="fas fa-shield-alt w-5 mr-3 text-gray-400 group-hover:text-primary-600"></i>
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-2"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 group"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-3 group-hover:text-red-700"></i>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-slide-down">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Search</h3>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-gray-500"></i>
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search everything..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </form>
              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Popular searches:</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">
                    ⌘K
                  </kbd>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Projects", "Students", "Meetings", "Reports"].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSearchQuery(item);
                          handleSearch({ preventDefault: () => {} });
                        }}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
