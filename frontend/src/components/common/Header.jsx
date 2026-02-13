import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Calendar from "../ui/Calendar";

// Icon component for consistent rendering
const Icon = ({ name, className = "", size = "text-base" }) => (
  <i
    className={`fas fa-${name} ${size} ${className}`}
    aria-hidden="true"
    style={{ fontFamily: "'Font Awesome 6 Free'", fontWeight: 900 }}
  ></i>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.string,
};

const Header = memo(
  ({
    isScrolled = false,
    notificationCount = 0,
    clearNotifications = () => {},
    onMobileMenuToggle,
    isMobileMenuOpen = false,
  }) => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme, themeMode } = useTheme();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const location = useLocation();

    const userMenuRef = useRef(null);
    const notificationsRef = useRef(null);
    const quickAddRef = useRef(null);
    const calendarRef = useRef(null);
    const searchRef = useRef(null);

    // Mock notifications data
    const notifications = useMemo(
      () => [
        {
          id: 1,
          title: "New project assigned",
          time: "5 min ago",
          read: false,
          icon: "diagram-project",
          color: "text-blue-500",
          bgColor: "bg-blue-100 dark:bg-blue-900/40",
        },
        {
          id: 2,
          title: "Deadline approaching",
          time: "1 hour ago",
          read: false,
          icon: "calendar-days",
          color: "text-red-500",
          bgColor: "bg-red-100 dark:bg-red-900/40",
        },
        {
          id: 3,
          title: "Weekly report ready",
          time: "2 hours ago",
          read: true,
          icon: "chart-column",
          color: "text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/40",
        },
        {
          id: 4,
          title: "System update completed",
          time: "1 day ago",
          read: true,
          icon: "rotate",
          color: "text-purple-500",
          bgColor: "bg-purple-100 dark:bg-purple-900/40",
        },
      ],
      [],
    );

    const unreadCount = useMemo(
      () => notifications.filter((n) => !n.read).length,
      [notifications],
    );

    // Close all dropdowns
    const closeAllDropdowns = useCallback(() => {
      setShowUserMenu(false);
      setShowNotifications(false);
      setShowQuickAdd(false);
      setShowCalendar(false);
      setShowSearch(false);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          userMenuRef.current &&
          !userMenuRef.current.contains(event.target)
        ) {
          setShowUserMenu(false);
        }
        if (
          notificationsRef.current &&
          !notificationsRef.current.contains(event.target)
        ) {
          setShowNotifications(false);
        }
        if (
          quickAddRef.current &&
          !quickAddRef.current.contains(event.target)
        ) {
          setShowQuickAdd(false);
        }
        if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target)
        ) {
          setShowCalendar(false);
        }
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowSearch(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          closeAllDropdowns();
        }
        if ((event.ctrlKey || event.metaKey) && event.key === "k") {
          event.preventDefault();
          setShowSearch(true);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeAllDropdowns]);

    // Close dropdowns on route change
    useEffect(() => {
      closeAllDropdowns();
    }, [location.pathname, closeAllDropdowns]);

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

    const handleSearch = useCallback(
      (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          console.log("Searching for:", searchQuery);
          setSearchQuery("");
          setShowSearch(false);
        }
      },
      [searchQuery],
    );

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

    // Quick Add actions based on user role
    const quickAddActions = useMemo(() => {
      const baseActions = [
        {
          icon: "diagram-project",
          label: user?.role === "admin" ? "New Project Type" : "New Project",
          color: "text-blue-600",
          bgColor: "bg-blue-100 dark:bg-blue-900/40",
          path: user?.role === "admin" ? "/project-types" : "/project-proposal",
        },
        {
          icon: "calendar-plus",
          label: "Schedule Meeting",
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900/40",
          path: "/meetings/new",
        },
        {
          icon: "file-lines",
          label: "Create Report",
          color: "text-purple-600",
          bgColor: "bg-purple-100 dark:bg-purple-900/40",
          path: "/reports",
        },
      ];

      if (user?.role === "admin" || user?.role === "faculty") {
        baseActions.push({
          icon: "user-plus",
          label: "Add Student",
          color: "text-indigo-600",
          bgColor: "bg-indigo-100 dark:bg-indigo-900/40",
          path: "/students/new",
        });
      }

      if (user?.role === "admin") {
        baseActions.push({
          icon: "book",
          label: "Create Course",
          color: "text-orange-600",
          bgColor: "bg-orange-100 dark:bg-orange-900/40",
          path: "/course-catalog",
        });
      }

      return baseActions;
    }, [user?.role]);

    const handleQuickAction = useCallback(
      (path) => {
        setShowQuickAdd(false);
        navigate(path);
      },
      [navigate],
    );

    const handleDateClick = useCallback(
      (date) => {
        console.log("Selected date:", date);
        setShowCalendar(false);
        navigate(`/meetings?date=${date.toISOString().split("T")[0]}`);
      },
      [navigate],
    );

    // Dropdown Component for reusability
    const Dropdown = ({ isOpen, children, className = "" }) => {
      if (!isOpen) return null;
      return (
        <div
          className={`
          absolute top-full right-0 mt-2
          w-72 sm:w-80
          bg-white dark:bg-gray-800 
          rounded-2xl shadow-2xl 
          border border-gray-200 dark:border-gray-700 
          overflow-hidden
          dropdown-enter
          ${className}
        `}
          style={{ zIndex: 9999 }}
        >
          {children}
        </div>
      );
    };

    Dropdown.propTypes = {
      isOpen: PropTypes.bool.isRequired,
      children: PropTypes.node.isRequired,
      className: PropTypes.string,
    };

    return (
      <>
        <header
          className={`
        sticky top-0 z-[100]
        w-full h-16
        bg-white/95 dark:bg-gray-900/95
        backdrop-blur-md
        transition-all duration-300
        ${
          isScrolled
            ? "shadow-lg dark:shadow-gray-800/50"
            : "border-b border-gray-200/80 dark:border-gray-700/80"
        }
      `}
        >
          <div className="w-full px-4 lg:px-6">
            <div className="flex items-center justify-between h-16 gap-4">
              {/* Left Section - Mobile Menu Button + Logo */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Mobile Menu Toggle */}
                <button
                  onClick={onMobileMenuToggle}
                  className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  aria-label="Toggle navigation menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <Icon
                    name={isMobileMenuOpen ? "xmark" : "bars"}
                    size="text-xl"
                  />
                </button>

                {/* Logo - Desktop */}
                <Link
                  to="/dashboard"
                  className="hidden md:flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                    <Icon
                      name="graduation-cap"
                      className="text-white"
                      size="text-lg"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                      Student Project System
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {getPageTitle()}
                    </p>
                  </div>
                </Link>

                {/* Logo - Mobile */}
                <Link
                  to="/dashboard"
                  className="flex md:hidden items-center gap-2"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                    <Icon
                      name="graduation-cap"
                      className="text-white"
                      size="text-sm"
                    />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    SPS
                  </span>
                </Link>
              </div>

              {/* Center Section - Search Bar (Desktop) */}
              <div
                className="hidden lg:flex flex-1 max-w-xl mx-4"
                ref={searchRef}
              >
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon
                        name="magnifying-glass"
                        className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        size="text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects, students, meetings..."
                      className="w-full pl-11 pr-20 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-700 text-sm dark:text-white dark:placeholder-gray-400 transition-all"
                      aria-label="Search"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md border border-gray-300 dark:border-gray-600">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Mobile Search Button */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="lg:hidden p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  aria-label="Open search"
                >
                  <Icon name="magnifying-glass" size="text-lg" />
                </button>

                {/* Quick Add Button - Desktop */}
                <div className="hidden md:block relative" ref={quickAddRef}>
                  <button
                    onClick={() => {
                      setShowQuickAdd(!showQuickAdd);
                      setShowCalendar(false);
                      setShowNotifications(false);
                      setShowUserMenu(false);
                    }}
                    className={`p-2.5 rounded-xl transition-all ${
                      showQuickAdd
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    title="Quick Add"
                    aria-label="Quick Add"
                    aria-expanded={showQuickAdd}
                  >
                    <Icon name="plus" size="text-lg" />
                  </button>

                  <Dropdown isOpen={showQuickAdd} className="w-60">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Icon
                          name="bolt"
                          className="text-yellow-500"
                          size="text-sm"
                        />
                        Quick Actions
                      </h3>
                    </div>
                    <div className="py-1">
                      {quickAddActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action.path)}
                          className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        >
                          <div
                            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${action.bgColor} mr-3 group-hover:scale-105 transition-transform`}
                          >
                            <Icon
                              name={action.icon}
                              className={action.color}
                              size="text-sm"
                            />
                          </div>
                          <span className="font-medium">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </Dropdown>
                </div>

                {/* Calendar Button - Desktop */}
                <div className="hidden md:block relative" ref={calendarRef}>
                  <button
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                      setShowQuickAdd(false);
                      setShowNotifications(false);
                      setShowUserMenu(false);
                    }}
                    className={`p-2.5 rounded-xl transition-all ${
                      showCalendar
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    title="Calendar"
                    aria-label="Open Calendar"
                    aria-expanded={showCalendar}
                  >
                    <Icon name="calendar-days" size="text-lg" />
                  </button>

                  {showCalendar && (
                    <div className="absolute top-full right-0 mt-2 z-50 animate-dropdown">
                      <Calendar onDateClick={handleDateClick} />
                    </div>
                  )}
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="hidden sm:flex p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  title={`Theme: ${themeMode === "auto" ? "Auto" : isDarkMode ? "Dark" : "Light"}`}
                  aria-label="Toggle theme"
                >
                  <Icon name={isDarkMode ? "sun" : "moon"} size="text-lg" />
                </button>

                {/* Divider */}
                <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                      setShowQuickAdd(false);
                      setShowCalendar(false);
                    }}
                    className={`relative p-2.5 rounded-xl transition-all ${
                      showNotifications
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
                    aria-expanded={showNotifications}
                  >
                    <Icon name="bell" size="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-[10px] font-bold text-white shadow-sm">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      </span>
                    )}
                  </button>

                  <Dropdown isOpen={showNotifications} className="w-80 sm:w-96">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Icon
                            name="bell"
                            className="text-blue-500"
                            size="text-sm"
                          />
                          Notifications
                        </h3>
                        <div className="flex items-center gap-3">
                          {unreadCount > 0 && (
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

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 transition-colors cursor-pointer ${
                            notification.read
                              ? "border-transparent"
                              : "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${notification.bgColor}`}
                            >
                              <Icon
                                name={notification.icon}
                                className={notification.color}
                                size="text-sm"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        View all notifications
                        <Icon name="arrow-right" size="text-xs" />
                      </Link>
                    </div>
                  </Dropdown>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                      setShowQuickAdd(false);
                      setShowCalendar(false);
                    }}
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    aria-expanded={showUserMenu}
                    aria-label="User menu"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <span className="text-white font-bold text-sm">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>

                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                        {getRoleLabel()}
                      </p>
                    </div>
                    <Icon
                      name="chevron-down"
                      className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""} hidden lg:block`}
                      size="text-xs"
                    />
                  </button>

                  <Dropdown isOpen={showUserMenu}>
                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <span className="text-white font-bold text-xl">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg capitalize">
                            <Icon name="shield-halved" size="text-[10px]" />
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
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                          <Icon
                            name="gauge-high"
                            className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            size="text-sm"
                          />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                          <Icon
                            name="user"
                            className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            size="text-sm"
                          />
                        </div>
                        <span className="font-medium">My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                          <Icon
                            name="gear"
                            className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            size="text-sm"
                          />
                        </div>
                        <span className="font-medium">Settings</span>
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin-dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                            <Icon
                              name="shield-halved"
                              className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                              size="text-sm"
                            />
                          </div>
                          <span className="font-medium">Admin Panel</span>
                        </Link>
                      )}

                      <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-4"></div>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center mr-3 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                          <Icon
                            name="right-from-bracket"
                            className="text-red-500"
                            size="text-sm"
                          />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Search Modal */}
        {showSearch && (
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowSearch(false)
            }
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-dropdown border border-gray-100 dark:border-gray-700">
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Icon
                      name="magnifying-glass"
                      className="text-blue-500"
                      size="text-sm"
                    />
                    Search
                  </h3>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    aria-label="Close search"
                  >
                    <Icon
                      name="xmark"
                      className="text-gray-500 dark:text-gray-400"
                      size="text-lg"
                    />
                  </button>
                </div>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon
                        name="magnifying-glass"
                        className="text-gray-400"
                        size="text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search everything..."
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      autoFocus
                    />
                  </div>
                </form>
                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="font-medium">Popular searches</span>
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600">
                      <span>⌘</span>K
                    </kbd>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Projects",
                      "Students",
                      "Meetings",
                      "Reports",
                      "Courses",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSearchQuery(item);
                          handleSearch({ preventDefault: () => {} });
                        }}
                        className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-200 rounded-xl transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>
      </>
    );
  },
);

Header.displayName = "Header";

Header.propTypes = {
  isScrolled: PropTypes.bool,
  notificationCount: PropTypes.number,
  clearNotifications: PropTypes.func,
  onMobileMenuToggle: PropTypes.func,
  isMobileMenuOpen: PropTypes.bool,
};

export default Header;
