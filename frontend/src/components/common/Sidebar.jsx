import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    admin: false,
    projects: false,
    resources: false,
    analytics: false,
  });

  // Get user role and set permissions
  const userRole = user?.role || "student";
  const isAdmin = userRole === "admin";
  const isFaculty = userRole === "faculty" || isAdmin;
  const isStudent = userRole === "student";

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigationItems = [
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
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const renderNavItem = (item, isSubmenu = false) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedSections[item.title.toLowerCase()] || false;
    const isActive = location.pathname === item.path;

    const baseClasses = `flex items-center ${
      isSubmenu ? "pl-8 pr-3 py-2 text-sm" : "px-4 py-3"
    } rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

    return (
      <div key={item.path || item.title} className="mb-1">
        {hasSubmenu ? (
          <>
            <button
              onClick={() => toggleSection(item.title.toLowerCase())}
              className={`w-full ${baseClasses} justify-between`}
            >
              <div className="flex items-center">
                {!isSubmenu && (
                  <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                )}
                <span className="font-medium">{item.title}</span>
              </div>
              <i
                className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-xs`}
              ></i>
            </button>
            {isExpanded && (
              <div className="mt-1 ml-2 border-l border-gray-200">
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
              `${baseClasses} ${isActive ? "bg-primary-500 text-white" : ""}`
            }
          >
            {!isSubmenu && (
              <i className={`${item.icon} mr-3 w-5 text-center`}></i>
            )}
            <span className="font-medium">{item.title}</span>
          </NavLink>
        )}
      </div>
    );
  };

  return (
    <aside className="sidebar bg-white border-r border-gray-200 w-64 md:w-72 h-full flex flex-col transition-all duration-300">
      {/* User Profile Info */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {user?.email || "user@university.edu"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {filteredItems.map((item) => renderNavItem(item))}
        </div>

        {/* Quick Stats (Admin/Faculty only) */}
        {(isAdmin || isFaculty) && (
          <div className="mt-8 px-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">
                System Status
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-bold text-green-600">48</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Active Students</span>
                  <span className="font-bold text-blue-600">156</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Upcoming Meetings</span>
                  <span className="font-bold text-purple-600">5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-3">
          {/* Settings & Profile Links */}
          <div className="flex space-x-2">
            <NavLink
              to="/profile"
              className="flex-1 flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Profile"
            >
              <i className="fas fa-user text-sm"></i>
            </NavLink>
            <NavLink
              to="/settings"
              className="flex-1 flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <i className="fas fa-cog text-sm"></i>
            </NavLink>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-sm"></i>
            </button>
          </div>

          {/* Current Date/Time */}
          <div className="text-center text-xs text-gray-500">
            <div>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
