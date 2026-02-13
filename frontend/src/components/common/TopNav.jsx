import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const TopNav = memo(
  ({
    isScrolled = false,
    isMobileMenuOpen = false,
    onMobileMenuToggle,
    onCloseMobileMenu,
  }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const dropdownTimeoutRef = useRef(null);

    // Theme-aware colors
    const colors = useMemo(
      () => ({
        // Background colors
        navBg: isDark ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
        navBgSolid: isDark ? "#111827" : "#ffffff",
        dropdownBg: isDark ? "#1f2937" : "#ffffff",
        hoverBg: isDark ? "#374151" : "#f3f4f6",
        activeBg: isDark ? "rgba(59, 130, 246, 0.2)" : "#eff6ff",
        mobileBg: isDark ? "#1f2937" : "#ffffff",
        mobileSubmenuBg: isDark ? "#111827" : "#f9fafb",
        userInfoBg: isDark
          ? "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))"
          : "linear-gradient(to right, #eff6ff, #e0e7ff)",
        quickActionsBg: isDark ? "#111827" : "#f9fafb",
        backdrop: "rgba(0, 0, 0, 0.5)",

        // Border colors
        border: isDark ? "#374151" : "#e5e7eb",
        borderLight: isDark ? "#4b5563" : "#f3f4f6",

        // Text colors
        text: isDark ? "#f3f4f6" : "#374151",
        textMuted: isDark ? "#9ca3af" : "#6b7280",
        textActive: "#3b82f6",
        textDark: isDark ? "#f9fafb" : "#111827",

        // Shadow
        shadow: isDark
          ? "0 10px 40px rgba(0, 0, 0, 0.4)"
          : "0 10px 40px rgba(0, 0, 0, 0.15)",
        navShadow: isDark
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }),
      [isDark],
    );

    // Get user role and set permissions
    const userRole = useMemo(() => user?.role || "student", [user?.role]);
    const isAdmin = useMemo(() => userRole === "admin", [userRole]);

    // Close mobile menu on route change
    useEffect(() => {
      onCloseMobileMenu?.();
      setActiveDropdown(null);
      setHoveredItem(null);
    }, [location.pathname, onCloseMobileMenu]);

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (navRef.current && !navRef.current.contains(event.target)) {
          setActiveDropdown(null);
          setHoveredItem(null);
        }
        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target)
        ) {
          if (!event.target.closest("[data-mobile-toggle]")) {
            onCloseMobileMenu?.();
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on escape key
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onCloseMobileMenu?.();
          setActiveDropdown(null);
          setHoveredItem(null);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onCloseMobileMenu]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (dropdownTimeoutRef.current) {
          clearTimeout(dropdownTimeoutRef.current);
        }
      };
    }, []);

    const handleMouseEnter = useCallback((itemTitle) => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      setHoveredItem(itemTitle);
      setActiveDropdown(itemTitle); // Also set active for click persistence
    }, []);

    const handleMouseLeave = useCallback(() => {
      dropdownTimeoutRef.current = setTimeout(() => {
        setHoveredItem(null);
        // Don't clear activeDropdown on mouse leave - only on click outside or navigation
      }, 150);
    }, []);

    // Handle click to toggle dropdown (for touch/click support)
    const handleDropdownClick = useCallback((e, itemTitle) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveDropdown((prev) => (prev === itemTitle ? null : itemTitle));
      setHoveredItem(itemTitle);
    }, []);

    const toggleDropdown = useCallback((section) => {
      setActiveDropdown((prev) => (prev === section ? null : section));
    }, []);

    const navigationItems = useMemo(
      () => [
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
              title: "All Projects",
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
              title: "Timeline",
              path: "/timeline",
              roles: ["admin", "faculty", "student"],
            },
            {
              title: "Milestones",
              path: "/milestones",
              roles: ["admin", "faculty", "student"],
            },
          ],
        },
        {
          title: "Students",
          icon: "fas fa-user-graduate",
          path: "/students",
          roles: ["admin", "faculty"],
          submenu: [
            {
              title: "Student List",
              path: "/students",
              roles: ["admin", "faculty"],
            },
            {
              title: "Attendance",
              path: "/attendance",
              roles: ["admin", "faculty"],
            },
          ],
        },
        {
          title: "Meetings",
          icon: "fas fa-calendar-alt",
          path: "/meetings",
          roles: ["admin", "faculty", "student"],
          submenu: [
            {
              title: "Calendar",
              path: "/meetings",
              roles: ["admin", "faculty", "student"],
            },
            {
              title: "Meeting List",
              path: "/meetings/list",
              roles: ["admin", "faculty", "student"],
            },
            {
              title: "Schedule Meeting",
              path: "/meetings/new",
              roles: ["admin", "faculty"],
            },
          ],
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
              title: "Course Materials",
              path: "/course-materials",
              roles: ["admin", "faculty", "student"],
            },
          ],
        },
        {
          title: "Assignments",
          icon: "fas fa-tasks",
          path: "/assignments",
          roles: ["admin", "faculty", "student"],
          submenu: [
            {
              title: "All Assignments",
              path: "/assignments",
              roles: ["admin", "faculty", "student"],
            },
            {
              title: "Upload Assignment",
              path: "/assignments/upload",
              roles: ["admin", "faculty"],
            },
            {
              title: "Submission History",
              path: "/submission-history",
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
              title: "Browse Resources",
              path: "/resources",
              roles: ["admin", "faculty", "student"],
            },
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
          ],
        },
        {
          title: "Collaboration",
          icon: "fas fa-users",
          path: "/chat",
          roles: ["admin", "faculty", "student"],
          submenu: [
            {
              title: "Team Chat",
              path: "/chat",
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
          ],
        },
        ...(isAdmin
          ? [
              {
                title: "Admin",
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
                    title: "System Settings",
                    path: "/system-settings",
                    roles: ["admin"],
                  },
                  { title: "Audit Log", path: "/audit-log", roles: ["admin"] },
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
              title: "Dashboard",
              path: "/analytics",
              roles: ["admin", "faculty"],
            },
            {
              title: "Performance",
              path: "/analytics/performance",
              roles: ["admin", "faculty"],
            },
            { title: "Reports", path: "/reports", roles: ["admin", "faculty"] },
          ],
        },
        {
          title: "Help",
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
              title: "Support",
              path: "/support",
              roles: ["admin", "faculty", "student"],
            },
          ],
        },
      ],
      [isAdmin],
    );

    const filteredItems = useMemo(
      () => navigationItems.filter((item) => item.roles.includes(userRole)),
      [navigationItems, userRole],
    );

    // Desktop nav item with dropdown
    const renderDesktopNavItem = (item) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isActive =
        location.pathname === item.path ||
        (hasSubmenu &&
          item.submenu.some((sub) => location.pathname === sub.path));
      const isOpen =
        hoveredItem === item.title || activeDropdown === item.title;

      return (
        <div
          key={item.title}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main nav button - clicking toggles dropdown, direct nav for items without submenu */}
          {hasSubmenu ? (
            <button
              onClick={(e) => handleDropdownClick(e, item.title)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 group ${
                isActive
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              style={{
                color: isActive ? colors.textActive : colors.text,
              }}
            >
              <i
                className={`${item.icon} mr-2 text-sm transition-transform group-hover:scale-110`}
              ></i>
              <span>{item.title}</span>
              <i
                className={`fas fa-chevron-down ml-2 text-[10px] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>
          ) : (
            <NavLink
              to={item.path}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 group ${
                isActive
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              style={{
                color: isActive ? colors.textActive : colors.text,
              }}
            >
              <i
                className={`${item.icon} mr-2 text-sm transition-transform group-hover:scale-110`}
              ></i>
              <span>{item.title}</span>
            </NavLink>
          )}

          {/* Dropdown Menu - renders when open with smooth animation */}
          {hasSubmenu && (
            <div
              className={`absolute top-full left-0 w-60 pt-2 transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible -translate-y-3 pointer-events-none"
              }`}
              style={{
                zIndex: 9999,
                willChange: isOpen ? "opacity, transform" : "auto",
              }}
            >
              {/* Invisible bridge to maintain hover connection */}
              <div className="absolute -top-2 left-0 right-0 h-4" />
              <div
                className="rounded-xl py-2 shadow-2xl backdrop-blur-sm animate-dropdown"
                style={{
                  backgroundColor: colors.dropdownBg,
                  boxShadow: `0 20px 40px rgba(0, 0, 0, ${isDark ? "0.4" : "0.15"}), 0 0 0 1px ${colors.border}`,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Dropdown header showing parent item */}
                <div
                  className="px-4 py-2 border-b mb-1"
                  style={{ borderColor: colors.borderLight }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      setHoveredItem(null);
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:text-blue-500 transition-colors"
                    style={{ color: colors.textMuted }}
                  >
                    <i className={`${item.icon} text-xs`}></i>
                    View All {item.title}
                  </NavLink>
                </div>
                {item.submenu
                  .filter((subItem) => subItem.roles.includes(userRole))
                  .map((subItem, index) => {
                    const subIsActive = location.pathname === subItem.path;
                    return (
                      <NavLink
                        key={`${item.title}-${subItem.path}-${index}`}
                        to={subItem.path}
                        onClick={() => {
                          setHoveredItem(null);
                          setActiveDropdown(null);
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 dark:hover:to-transparent hover:pl-5 group ${
                          subIsActive ? "bg-blue-50 dark:bg-blue-900/30" : ""
                        }`}
                        style={{
                          color: subIsActive ? colors.textActive : colors.text,
                        }}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                            subIsActive
                              ? "bg-blue-500 scale-125"
                              : "bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 group-hover:scale-110"
                          }`}
                        ></span>
                        <span className="font-medium">{subItem.title}</span>
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      );
    };

    // Mobile nav item
    const renderMobileNavItem = (item) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isActive =
        location.pathname === item.path ||
        (hasSubmenu &&
          item.submenu.some((sub) => location.pathname === sub.path));
      const isOpen = activeDropdown === item.title;

      if (hasSubmenu) {
        return (
          <div
            key={`mobile-${item.title}`}
            className="border-b transition-colors"
            style={{ borderColor: colors.borderLight }}
          >
            <button
              onClick={() => toggleDropdown(item.title)}
              className={`flex items-center justify-between w-full px-4 py-3.5 text-left text-sm transition-all duration-200 ${
                isOpen ? "bg-gray-50 dark:bg-gray-800/50" : ""
              }`}
              style={{
                backgroundColor:
                  isActive && !isOpen ? colors.activeBg : undefined,
                color: isActive ? colors.textActive : colors.text,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600"
                      : "bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                </div>
                <span className="font-medium">{item.title}</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? "bg-blue-100 dark:bg-blue-900/40 rotate-180"
                    : "bg-gray-100 dark:bg-gray-700/50"
                }`}
              >
                <i
                  className="fas fa-chevron-down text-[10px]"
                  style={{
                    color: isOpen ? colors.textActive : colors.textMuted,
                  }}
                ></i>
              </div>
            </button>

            {/* Accordion submenu with smooth animation */}
            <div
              className={`transition-all duration-300 ease-out ${
                isOpen
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
              style={{ backgroundColor: colors.mobileSubmenuBg }}
            >
              {/* View All Link */}
              <NavLink
                to={item.path}
                onClick={() => onCloseMobileMenu?.()}
                className="flex items-center gap-2 py-2.5 pl-14 pr-4 text-xs font-semibold uppercase tracking-wider border-b transition-colors hover:text-blue-500"
                style={{
                  color: colors.textMuted,
                  borderColor: colors.borderLight,
                }}
              >
                <i className={`${item.icon} text-xs`}></i>
                View All {item.title}
              </NavLink>
              {item.submenu
                .filter((subItem) => subItem.roles.includes(userRole))
                .map((subItem, index) => {
                  const subIsActive = location.pathname === subItem.path;
                  return (
                    <NavLink
                      key={`mobile-${item.title}-${subItem.path}-${index}`}
                      to={subItem.path}
                      onClick={() => onCloseMobileMenu?.()}
                      className={`flex items-center gap-3 py-3 pl-14 pr-4 text-sm transition-all duration-200 hover:pl-16 ${
                        subIsActive
                          ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                          : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
                      }`}
                      style={{
                        color: subIsActive ? colors.textActive : colors.text,
                      }}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-all ${
                          subIsActive
                            ? "bg-blue-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></span>
                      <span className={subIsActive ? "font-medium" : ""}>
                        {subItem.title}
                      </span>
                    </NavLink>
                  );
                })}
            </div>
          </div>
        );
      }

      return (
        <NavLink
          key={`mobile-nav-${item.path}`}
          to={item.path}
          onClick={() => onCloseMobileMenu?.()}
          className={`flex items-center gap-3 px-4 py-3.5 text-sm border-b transition-all duration-200 ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/20"
              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
          style={{
            borderColor: colors.borderLight,
            color: isActive ? colors.textActive : colors.text,
          }}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isActive
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600"
                : "bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
            }`}
          >
            <i className={`${item.icon} text-sm`}></i>
          </div>
          <span className="font-medium">{item.title}</span>
          {isActive && (
            <span className="ml-auto w-2 h-2 rounded-full bg-blue-500"></span>
          )}
        </NavLink>
      );
    };

    return (
      <nav
        ref={navRef}
        className={`fixed top-16 left-0 right-0 z-50 transition-all duration-300 nav-loaded ${
          isScrolled ? "backdrop-blur-md shadow-md" : ""
        }`}
        style={{
          backgroundColor: isScrolled ? colors.navBg : colors.navBgSolid,
          borderBottom: `1px solid ${colors.border}`,
          overflow: "visible", // Critical: allow dropdowns to overflow
        }}
      >
        <div className="w-full px-4 lg:px-6" style={{ overflow: "visible" }}>
          {/* Desktop Navigation - lg and above */}
          <div
            className="hidden lg:flex items-center h-14"
            style={{ overflow: "visible" }}
          >
            <div
              className="flex items-center gap-0.5 flex-wrap"
              style={{ overflow: "visible" }}
            >
              {filteredItems.map((item) => renderDesktopNavItem(item))}
            </div>
          </div>

          {/* Tablet Navigation - md to lg */}
          <div
            className="hidden md:flex lg:hidden items-center justify-between h-14"
            style={{ overflow: "visible" }}
          >
            <div
              className="flex items-center gap-0.5 flex-1"
              style={{ overflow: "visible" }}
            >
              {filteredItems
                .slice(0, 6)
                .map((item) => renderDesktopNavItem(item))}
            </div>

            {filteredItems.length > 6 && (
              <div className="relative ml-2">
                <button
                  onClick={() => toggleDropdown("more")}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                  style={{ color: colors.text }}
                >
                  <span>More</span>
                  <i
                    className={`fas fa-chevron-down ml-2 text-[10px] transition-transform duration-300 ${
                      activeDropdown === "more" ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {activeDropdown === "more" && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl py-2"
                    style={{
                      zIndex: 9999,
                      backgroundColor: colors.dropdownBg,
                      boxShadow: colors.shadow,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {filteredItems.slice(6).map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        style={{ color: colors.text }}
                      >
                        <i className={`${item.icon} w-5 mr-3 text-center`}></i>
                        {item.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Navigation - below md */}
          <div className="flex md:hidden items-center justify-between h-12">
            <button
              onClick={onMobileMenuToggle}
              data-mobile-toggle
              className="inline-flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              style={{ color: colors.text }}
            >
              <i
                className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-lg mr-2`}
              ></i>
              <span className="font-medium text-sm">Menu</span>
            </button>

            <span
              className="text-sm font-medium max-w-[150px] truncate"
              style={{ color: colors.textMuted }}
            >
              {filteredItems.find(
                (item) =>
                  location.pathname === item.path ||
                  item.submenu?.some((sub) => location.pathname === sub.path),
              )?.title || "Navigation"}
            </span>

            <NavLink
              to="/profile"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: colors.textMuted }}
            >
              <i className="fas fa-user"></i>
            </NavLink>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => onCloseMobileMenu?.()}
              className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
            />

            {/* Menu Panel */}
            <div
              ref={mobileMenuRef}
              className="absolute top-full left-0 right-0 max-h-[calc(100vh-8rem)] overflow-y-auto z-50 md:hidden animate-slideDown"
              style={{
                backgroundColor: colors.mobileBg,
                boxShadow: colors.shadow,
              }}
            >
              {/* User Info */}
              <div
                className="p-4 border-b"
                style={{
                  background: colors.userInfoBg,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-500 to-purple-600">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: colors.textDark }}
                    >
                      {user?.name || "User"}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: colors.textMuted }}
                    >
                      {user?.email || "user@email.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav Items */}
              <div className="py-2">
                {filteredItems.map((item) => renderMobileNavItem(item))}
              </div>

              {/* Quick Actions */}
              <div
                className="px-4 py-3 border-t"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.quickActionsBg,
                }}
              >
                <div className="flex items-center justify-around">
                  <NavLink
                    to="/profile"
                    onClick={() => onCloseMobileMenu?.()}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    style={{ color: colors.textMuted }}
                  >
                    <i className="fas fa-user text-lg mb-1"></i>
                    <span className="text-xs">Profile</span>
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => onCloseMobileMenu?.()}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    style={{ color: colors.textMuted }}
                  >
                    <i className="fas fa-cog text-lg mb-1"></i>
                    <span className="text-xs">Settings</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      onCloseMobileMenu?.();
                    }}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    style={{ color: colors.textMuted }}
                  >
                    <i className="fas fa-sign-out-alt text-lg mb-1"></i>
                    <span className="text-xs">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CSS for animations and scrollbar */}
        <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes accordionOpen {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        @keyframes navLoad {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
        .animate-accordionOpen {
          animation: accordionOpen 0.25s ease-out forwards;
        }
        .nav-loaded {
          animation: navLoad 0.3s ease-out;
        }
      `}</style>
      </nav>
    );
  },
);

TopNav.displayName = "TopNav";

TopNav.propTypes = {
  isScrolled: PropTypes.bool,
  isMobileMenuOpen: PropTypes.bool,
  onMobileMenuToggle: PropTypes.func,
  onCloseMobileMenu: PropTypes.func,
};

export default TopNav;
