import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";

const Sidebar = memo(() => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    admin: false,
    projects: false,
    resources: false,
    analytics: false,
    collaboration: false,
    portfolio: false,
    courses: false,
    "help & support": false,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get user role and set permissions
  const userRole = useMemo(() => user?.role || "student", [user?.role]);
  const isAdmin = useMemo(() => userRole === "admin", [userRole]);
  const isFaculty = useMemo(() => userRole === "faculty" || isAdmin, [userRole, isAdmin]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const navigationItems = useMemo(() => [
    {
      title: "Dashboard",
      icon: "fas fa-home",
      path: "/dashboard",
      roles: ["admin", "faculty", "student"],
    },
    {
      title: "Projects",
      icon: "fas fa-project-diagram",
      path: "/projects",
      roles: ["admin", "faculty", "student"],
      submenu: [
        {
          title: "My Projects",
          path: "/projects",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Project Proposal",
          path: "/project-proposal",
          roles: ["student", "faculty"],
        },
        {
          title: "Project Groups",
          path: "/project-groups",
          roles: ["admin", "faculty"],
        },
        {
          title: "Guide Allocation",
          path: "/guide-allocation",
          roles: ["admin", "faculty"],
        },
        {
          title: "Project Types",
          path: "/project-types",
          roles: ["admin", "faculty"],
        },
      ],
    },
    {
      title: "Students",
      icon: "fas fa-user-graduate",
      path: "/students",
      roles: ["admin", "faculty"],
    },
    {
      title: "Meetings",
      icon: "fas fa-calendar-alt",
      path: "/meetings",
      roles: ["admin", "faculty", "student"],
    },
    {
      title: "Courses",
      icon: "fas fa-book",
      path: "/courses",
      roles: ["admin", "faculty", "student"],
      submenu: [
        {
          title: "My Courses",
          path: "/courses",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Course Catalog",
          path: "/course-catalog",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Course Schedule",
          path: "/course-schedule",
          roles: ["admin", "faculty", "student"],
        },
      ],
    },
    {
      title: "Assignments",
      icon: "fas fa-tasks",
      path: "/assignments",
      roles: ["admin", "faculty", "student"],
    },
    {
      title: "Portfolio",
      icon: "fas fa-briefcase",
      path: "/portfolio",
      roles: ["admin", "faculty", "student"],
      submenu: [
        {
          title: "Portfolio View",
          path: "/portfolio",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Portfolio Builder",
          path: "/portfolio-builder",
          roles: ["student"],
        },
        {
          title: "Achievements",
          path: "/achievements",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Skills Matrix",
          path: "/skills",
          roles: ["admin", "faculty", "student"],
        },
      ],
    },
    {
      title: "Resources",
      icon: "fas fa-folder-open",
      path: "/resources",
      roles: ["admin", "faculty", "student"],
      submenu: [
        {
          title: "Document Library",
          path: "/documents",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Templates",
          path: "/templates",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Tutorial Videos",
          path: "/tutorials",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Upload Resources",
          path: "/resource-upload",
          roles: ["admin", "faculty"],
        },
      ],
    },
    {
      title: "Collaboration",
      icon: "fas fa-users",
      path: "/team-chat",
      roles: ["admin", "faculty", "student"],
      submenu: [
        {
          title: "Team Chat",
          path: "/team-chat",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Discussions",
          path: "/discussions",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "File Sharing",
          path: "/file-sharing",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Team Directory",
          path: "/team-directory",
          roles: ["admin", "faculty", "student"],
        },
      ],
    },
    // Admin only items
    ...(isAdmin
      ? [
          {
            title: "Administration",
            icon: "fas fa-cogs",
            path: "/admin-dashboard",
            roles: ["admin"],
            submenu: [
              {
                title: "Admin Dashboard",
                path: "/admin-dashboard",
                roles: ["admin"],
              },
              {
                title: "User Management",
                path: "/user-management",
                roles: ["admin"],
              },
              {
                title: "Staff Management",
                path: "/staff",
                roles: ["admin"],
              },
              {
                title: "System Settings",
                path: "/system-settings",
                roles: ["admin"],
              },
              {
                title: "Audit Log",
                path: "/audit-log",
                roles: ["admin"],
              },
            ],
          },
        ]
      : []),
    {
      title: "Analytics",
      icon: "fas fa-chart-bar",
      path: "/analytics",
      roles: ["admin", "faculty"],
      submenu: [
        {
          title: "Analytics Dashboard",
          path: "/analytics",
          roles: ["admin", "faculty"],
        },
        {
          title: "Performance Metrics",
          path: "/analytics/performance",
          roles: ["admin", "faculty"],
        },
        {
          title: "Usage Statistics",
          path: "/analytics/usage",
          roles: ["admin", "faculty"],
        },
      ],
    },
    {
      title: "Reports",
      icon: "fas fa-file-alt",
      path: "/reports",
      roles: ["admin", "faculty"],
    },
    {
      title: "Help & Support",
      icon: "fas fa-question-circle",
      path: "/help",
      roles: ["admin", "faculty", "student"],
      submenu: [
        {
          title: "Help Center",
          path: "/help",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "FAQ",
          path: "/faq",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Knowledge Base",
          path: "/knowledge-base",
          roles: ["admin", "faculty", "student"],
        },
        {
          title: "Support Tickets",
          path: "/support",
          roles: ["admin", "faculty", "student"],
        },
      ],
    },
  ], [isAdmin]);

  const filteredItems = useMemo(
    () => navigationItems.filter((item) => item.roles.includes(userRole)),
    [navigationItems, userRole]
  );

  const renderNavItem = useCallback((item, isSubmenu = false) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedSections[item.title.toLowerCase()] || false;
    const isActive = location.pathname === item.path;

    const baseClasses = `flex items-center ${
      isSubmenu ? "pl-8 pr-3 py-2 text-sm" : "px-4 py-3"
    } rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
    }`;

    return (
      <div key={item.path || item.title} className="mb-1">
        {hasSubmenu ? (
          <>
            <button
              onClick={() => toggleSection(item.title.toLowerCase())}
              className={`w-full ${baseClasses} justify-between`}
              aria-expanded={isExpanded}
              aria-label={`${item.title} menu`}
            >
              <div className="flex items-center">
                {!isSubmenu && (
                  <i className={`${item.icon} mr-3 w-5 text-center`} aria-hidden="true"></i>
                )}
                <span className="font-medium">{item.title}</span>
              </div>
              <i
                className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-xs`}
                aria-hidden="true"
              ></i>
            </button>
            {isExpanded && (
              <div className="mt-1 ml-2 border-l border-gray-200 dark:border-gray-700">
                {item.submenu
                  .filter((subItem) => subItem.roles.includes(userRole))
                  .map((subItem) => renderNavItem(subItem, true))}
              </div>
            )}
          </>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? "bg-blue-500 text-white" : ""}`
            }
            aria-current={isActive ? "page" : undefined}
          >
            {!isSubmenu && (
              <i className={`${item.icon} mr-3 w-5 text-center`} aria-hidden="true"></i>
            )}
            <span className="font-medium">{item.title}</span>
          </NavLink>
        )}
      </div>
    );
  }, [expandedSections, location.pathname, toggleSection, userRole]);

  return (
    <aside 
      className="sidebar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 md:w-72 h-full flex flex-col transition-all duration-300"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* User Profile Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div 
              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
              aria-label="Online"
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || "User"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user?.email || "user@university.edu"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2" aria-label="Sidebar navigation">
        <div className="space-y-1">
          {filteredItems.map((item) => renderNavItem(item))}
        </div>

        {/* Quick Stats (Admin/Faculty only) */}
        {(isAdmin || isFaculty) && (
          <div className="mt-8 px-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2">
                System Status
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Active Projects</span>
                  <span className="font-bold text-green-600 dark:text-green-400">48</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Active Students</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">156</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Upcoming Meetings</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="space-y-3">
          {/* Settings & Profile Links */}
          <div className="flex space-x-2">
            <NavLink
              to="/profile"
              className="flex-1 flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Profile"
              aria-label="Go to profile"
            >
              <i className="fas fa-user text-sm" aria-hidden="true"></i>
            </NavLink>
            <NavLink
              to="/settings"
              className="flex-1 flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Settings"
              aria-label="Go to settings"
            >
              <i className="fas fa-cog text-sm" aria-hidden="true"></i>
            </NavLink>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
              title="Logout"
              aria-label="Sign out"
            >
              <i className="fas fa-sign-out-alt text-sm" aria-hidden="true"></i>
            </button>
          </div>

          {/* Current Date/Time */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <div>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
