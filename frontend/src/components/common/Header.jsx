import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import Calendar from "../ui/Calendar";
import HeaderIcon from "./header/HeaderIcon";
import SearchBar from "./header/SearchBar";
import NotificationMenu from "./header/NotificationMenu";
import UserMenu from "./header/UserMenu";
import QuickAddMenu from "./header/QuickAddMenu";

/**
 * Header Component
 *
 * Main application header featuring global search (Ctrl+K), quick
 * role-based action menus, notification alerts, an integrated
 * project calendar, and user profile management.
 */
const Header = memo(
  ({
    isScrolled = false,
    clearNotifications = () => {},
    onMobileMenuToggle,
    isMobileMenuOpen = false,
  }) => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Dropdown states
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Refs for outside click handling
    const userMenuRef = useRef(null);
    const notificationsRef = useRef(null);
    const quickAddRef = useRef(null);
    const calendarRef = useRef(null);

    // Mock notifications data (should ideally come from a hook/context)
    const notifications = useMemo(() => [], []);
    const unreadCount = useMemo(
      () => notifications.filter((n) => !n.read).length,
      [notifications],
    );

    const closeAllDropdowns = useCallback(() => {
      setShowUserMenu(false);
      setShowNotifications(false);
      setShowQuickAdd(false);
      setShowCalendar(false);
      setShowSearch(false);
    }, []);

    // Outside click handler
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target))
          setShowUserMenu(false);
        if (
          notificationsRef.current &&
          !notificationsRef.current.contains(event.target)
        )
          setShowNotifications(false);
        if (quickAddRef.current && !quickAddRef.current.contains(event.target))
          setShowQuickAdd(false);
        if (calendarRef.current && !calendarRef.current.contains(event.target))
          setShowCalendar(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") closeAllDropdowns();
        if ((event.ctrlKey || event.metaKey) && event.key === "k") {
          event.preventDefault();
          setShowSearch(true);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeAllDropdowns]);

    // Close on route change
    useEffect(() => {
      closeAllDropdowns();
    }, [location.pathname, closeAllDropdowns]);

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
      const parts = user.name.split(" ");
      return (parts[0][0] + (parts[1] ? parts[1][0] : ""))
        .toUpperCase()
        .slice(0, 2);
    }, [user?.name]);

    const getPageTitle = useCallback(() => {
      const path = location.pathname.split("/").pop();
      if (!path || path === "dashboard") return "Dashboard";

      const titles = {
        projects: "Projects",
        students: "Students",
        meetings: "Meetings",
        reports: "Reports",
        profile: "Profile",
        settings: "Settings",
      };

      return (
        titles[path] ||
        path.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
      );
    }, [location.pathname]);

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

      return baseActions;
    }, [user?.role]);

    const handleQuickAction = useCallback(
      (path) => {
        setShowQuickAdd(false);
        navigate(path);
      },
      [navigate],
    );

    const Dropdown = ({ isOpen, children, className = "" }) => {
      if (!isOpen) return null;
      return (
        <div
          className={`absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden dropdown-enter z-[9999] ${className}`}
        >
          {children}
        </div>
      );
    };

    return (
      <>
        <header
          className={`sticky top-0 z-[100] w-full h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? "shadow-lg dark:shadow-gray-800/50" : "border-b border-gray-200/80 dark:border-gray-700/80"}`}
        >
          <div className="w-full px-4 lg:px-6 h-full">
            <div className="flex items-center justify-between h-full gap-4">
              {/* Logo Section */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onMobileMenuToggle}
                  className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Toggle mobile menu"
                >
                  <HeaderIcon
                    name={isMobileMenuOpen ? "xmark" : "bars"}
                    size="text-xl"
                  />
                </button>
                <Link to="/dashboard" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <HeaderIcon
                      name="graduation-cap"
                      className="text-white"
                      size="text-lg"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                      Student Project System
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {getPageTitle()}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-xl mx-4">
                <SearchBar onSearch={(q) => console.log("Search:", q)} />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setShowSearch(true)}
                  className="lg:hidden p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  aria-label="Search"
                >
                  <HeaderIcon name="magnifying-glass" size="text-lg" />
                </button>

                <div className="hidden md:block relative" ref={quickAddRef}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowQuickAdd(!showQuickAdd);
                    }}
                    className={`p-2.5 rounded-xl transition-all ${showQuickAdd ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    aria-label="Quick Actions"
                  >
                    <HeaderIcon name="plus" size="text-lg" />
                  </button>
                  <Dropdown isOpen={showQuickAdd} className="w-60">
                    <QuickAddMenu
                      actions={quickAddActions}
                      onActionClick={handleQuickAction}
                    />
                  </Dropdown>
                </div>

                <div className="hidden md:block relative" ref={calendarRef}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowCalendar(!showCalendar);
                    }}
                    className={`p-2.5 rounded-xl transition-all ${showCalendar ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    aria-label="Calendar"
                  >
                    <HeaderIcon name="calendar-days" size="text-lg" />
                  </button>
                  {showCalendar && (
                    <div className="absolute top-full right-0 mt-2 z-50 animate-dropdown">
                      <Calendar
                        onDateClick={(date) => {
                          setShowCalendar(false);
                          navigate(
                            `/meetings?date=${date.toISOString().split("T")[0]}`,
                          );
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleTheme}
                  className="hidden sm:flex p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  aria-label="Toggle theme"
                >
                  <HeaderIcon
                    name={isDarkMode ? "sun" : "moon"}
                    size="text-lg"
                  />
                </button>

                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowNotifications(!showNotifications);
                    }}
                    className={`relative p-2.5 rounded-xl transition-all ${showNotifications ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    aria-label="Notifications"
                  >
                    <HeaderIcon name="bell" size="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
                        <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-[10px] font-bold text-white shadow-sm">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      </span>
                    )}
                  </button>
                  <Dropdown isOpen={showNotifications} className="w-80 sm:w-96">
                    <NotificationMenu
                      notifications={notifications}
                      unreadCount={unreadCount}
                      onMarkAllAsRead={() => {
                        clearNotifications();
                        setShowNotifications(false);
                      }}
                      onClose={() => setShowNotifications(false)}
                    />
                  </Dropdown>
                </div>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                        {getRoleLabel()}
                      </p>
                    </div>
                  </button>
                  <Dropdown isOpen={showUserMenu}>
                    <UserMenu
                      user={user}
                      initials={getUserInitials()}
                      onLogout={logout}
                      onClose={() => setShowUserMenu(false)}
                    />
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </header>

        {showSearch && (
          <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowSearch(false)
            }
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-dropdown border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <HeaderIcon
                    name="magnifying-glass"
                    className="text-blue-500"
                    size="text-sm"
                  />
                  Search
                </h3>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                >
                  <HeaderIcon name="xmark" size="text-lg" />
                </button>
              </div>
              <SearchBar
                onSearch={(q) => {
                  console.log("Search:", q);
                  setShowSearch(false);
                }}
                isMobile={true}
              />
            </div>
          </div>
        )}
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
