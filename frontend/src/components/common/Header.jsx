import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Header = memo(({
  isScrolled = false,
  notificationCount = 0,
  clearNotifications = () => {},
}) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, themeMode } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  // Mock notifications data - should be replaced with real data from backend
  const notifications = useMemo(() => [
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
  ], []);

  // Get unread count
  const unreadCount = useMemo(() => 
    notifications.filter((n) => !n.read).length,
    [notifications]
  );

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

  // Close dropdowns on escape key and handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close modals on Escape
      if (event.key === "Escape") {
        setShowUserMenu(false);
        setShowNotifications(false);
        setShowSearch(false);
      }
      
      // Open search on Ctrl+K or Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    clearNotifications();
    setShowNotifications(false);
  }, [clearNotifications]);

  const getRoleLabel = useCallback(() => {
    const roles = {
      admin: "Administrator",
      faculty: "Faculty Member",
      student: "Student",
    };
    return roles[user?.role] || "User";
  }, [user?.role]);

  const getUserInitials = useCallback(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement actual search functionality
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      setShowSearch(false);
    }
  }, [searchQuery]);

  const getPageTitle = useCallback(() => {
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
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-900/95"
          : "bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800"
      }`}
      role="banner"
    >
      <div className="h-16 px-4 md:px-6">
        <div className="flex justify-between items-center h-full">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <i className="fas fa-graduation-cap text-white text-lg" aria-hidden="true"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  Project Management
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {getPageTitle()}
                </p>
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="md:hidden">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white" aria-hidden="true"></i>
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-sm">PMS</span>
              </div>
            </div>
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xl mx-8" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, students, meetings..."
                  className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 text-sm dark:text-white dark:placeholder-gray-400"
                  aria-label="Search"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs font-sans bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
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
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Open search"
            >
              <i className="fas fa-search" aria-hidden="true"></i>
            </button>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Quick Add"
                aria-label="Quick Add"
              >
                <i className="fas fa-plus" aria-hidden="true"></i>
              </button>
              <button
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Calendar"
                aria-label="Open Calendar"
              >
                <i className="fas fa-calendar-alt" aria-hidden="true"></i>
              </button>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={`Theme: ${themeMode === 'auto' ? 'Auto' : isDarkMode ? 'Dark' : 'Light'}`}
                aria-label="Toggle theme"
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true"></i>
              </button>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
                aria-expanded={showNotifications}
                aria-haspopup="true"
              >
                <i className="fas fa-bell text-lg" aria-hidden="true"></i>
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
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 animate-slide-down"
                  role="menu"
                  aria-label="Notifications menu"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <div className="flex items-center space-x-2">
                        {notificationCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                        <Link
                          to="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 ${
                          notification.read
                            ? "border-transparent"
                            : "border-blue-500"
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${notification.color.split(" ")[1]} dark:opacity-90`}
                          >
                            <i
                              className={`fas ${notification.icon} ${notification.color.split(" ")[0]} text-sm`}
                              aria-hidden="true"
                            ></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
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
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" aria-label="Online"></div>
                </div>

                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {getRoleLabel()}
                  </p>
                </div>
                <i
                  className={`fas fa-chevron-down text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                    showUserMenu ? "transform rotate-180" : ""
                  } hidden lg:block`}
                  aria-hidden="true"
                ></i>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 animate-slide-down"
                  role="menu"
                  aria-label="User menu"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full capitalize">
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
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group"
                      role="menuitem"
                    >
                      <i className="fas fa-tachometer-alt w-5 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" aria-hidden="true"></i>
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group"
                      role="menuitem"
                    >
                      <i className="fas fa-user w-5 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" aria-hidden="true"></i>
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group"
                      role="menuitem"
                    >
                      <i className="fas fa-cog w-5 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" aria-hidden="true"></i>
                      Settings
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group"
                        role="menuitem"
                      >
                        <i className="fas fa-shield-alt w-5 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" aria-hidden="true"></i>
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 group"
                      role="menuitem"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-3 group-hover:text-red-700 dark:group-hover:text-red-300" aria-hidden="true"></i>
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
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg animate-slide-down">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 id="search-modal-title" className="font-semibold text-gray-900 dark:text-white">Search</h3>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close search"
                >
                  <i className="fas fa-times text-gray-500 dark:text-gray-400" aria-hidden="true"></i>
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search everything..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    aria-label="Search input"
                  />
                </div>
              </form>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Popular searches:</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
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
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg transition-colors"
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
});

Header.displayName = "Header";

Header.propTypes = {
  isScrolled: PropTypes.bool,
  notificationCount: PropTypes.number,
  clearNotifications: PropTypes.func,
};

export default Header;
