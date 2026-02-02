import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const TopNav = memo(({ isScrolled = false }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Theme-aware colors
  const colors = useMemo(() => ({
    // Background colors
    navBg: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    navBgSolid: isDark ? '#111827' : '#ffffff',
    dropdownBg: isDark ? '#1f2937' : '#ffffff',
    hoverBg: isDark ? '#374151' : '#f3f4f6',
    activeBg: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff',
    mobileBg: isDark ? '#1f2937' : '#ffffff',
    mobileSubmenuBg: isDark ? '#111827' : '#f9fafb',
    userInfoBg: isDark ? 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))' : 'linear-gradient(to right, #eff6ff, #e0e7ff)',
    quickActionsBg: isDark ? '#111827' : '#f9fafb',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    
    // Border colors
    border: isDark ? '#374151' : '#e5e7eb',
    borderLight: isDark ? '#4b5563' : '#f3f4f6',
    
    // Text colors
    text: isDark ? '#f3f4f6' : '#374151',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    textActive: '#3b82f6',
    textDark: isDark ? '#f9fafb' : '#111827',
    
    // Shadow
    shadow: isDark ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.15)',
    navShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }), [isDark]);

  // Get user role and set permissions
  const userRole = useMemo(() => user?.role || "student", [user?.role]);
  const isAdmin = useMemo(() => userRole === "admin", [userRole]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setHoveredItem(null);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setHoveredItem(null);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        if (!event.target.closest('[data-mobile-toggle]')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
        setHoveredItem(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
  }, []);

  const handleMouseLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 100);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    setActiveDropdown(null);
  }, []);

  const toggleDropdown = useCallback((section) => {
    setActiveDropdown((prev) => (prev === section ? null : section));
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
        { title: "All Projects", path: "/projects", roles: ["admin", "faculty", "student"] },
        { title: "Project Proposal", path: "/project-proposal", roles: ["student", "faculty"] },
        { title: "Project Groups", path: "/project-groups", roles: ["admin", "faculty"] },
        { title: "Guide Allocation", path: "/guide-allocation", roles: ["admin", "faculty"] },
        { title: "Timeline", path: "/timeline", roles: ["admin", "faculty", "student"] },
        { title: "Milestones", path: "/milestones", roles: ["admin", "faculty", "student"] },
      ],
    },
    {
      title: "Students",
      icon: "fas fa-user-graduate",
      path: "/students",
      roles: ["admin", "faculty"],
      submenu: [
        { title: "Student List", path: "/students", roles: ["admin", "faculty"] },
        { title: "Attendance", path: "/attendance", roles: ["admin", "faculty"] },
      ],
    },
    {
      title: "Meetings",
      icon: "fas fa-calendar-alt",
      path: "/meetings",
      roles: ["admin", "faculty", "student"],
      submenu: [
        { title: "Calendar", path: "/meetings", roles: ["admin", "faculty", "student"] },
        { title: "Meeting List", path: "/meetings/list", roles: ["admin", "faculty", "student"] },
        { title: "Schedule Meeting", path: "/meetings/new", roles: ["admin", "faculty"] },
      ],
    },
    {
      title: "Courses",
      icon: "fas fa-book",
      path: "/courses",
      roles: ["admin", "faculty", "student"],
      submenu: [
        { title: "My Courses", path: "/courses", roles: ["admin", "faculty", "student"] },
        { title: "Course Catalog", path: "/course-catalog", roles: ["admin", "faculty", "student"] },
        { title: "Course Materials", path: "/course-materials", roles: ["admin", "faculty", "student"] },
      ],
    },
    {
      title: "Assignments",
      icon: "fas fa-tasks",
      path: "/assignments",
      roles: ["admin", "faculty", "student"],
      submenu: [
        { title: "All Assignments", path: "/assignments", roles: ["admin", "faculty", "student"] },
        { title: "Upload Assignment", path: "/assignments/upload", roles: ["admin", "faculty"] },
        { title: "Submission History", path: "/submission-history", roles: ["admin", "faculty", "student"] },
      ],
    },
    {
      title: "Resources",
      icon: "fas fa-folder-open",
      path: "/resources",
      roles: ["admin", "faculty", "student"],
      submenu: [
        { title: "Browse Resources", path: "/resources", roles: ["admin", "faculty", "student"] },
        { title: "Document Library", path: "/documents", roles: ["admin", "faculty", "student"] },
        { title: "Templates", path: "/templates", roles: ["admin", "faculty", "student"] },
      ],
    },
    {
      title: "Collaboration",
      icon: "fas fa-users",
      path: "/chat",
      roles: ["admin", "faculty", "student"],
      submenu: [
        { title: "Team Chat", path: "/chat", roles: ["admin", "faculty", "student"] },
        { title: "Discussions", path: "/discussions", roles: ["admin", "faculty", "student"] },
        { title: "File Sharing", path: "/file-sharing", roles: ["admin", "faculty", "student"] },
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
              { title: "Admin Dashboard", path: "/admin-dashboard", roles: ["admin"] },
              { title: "User Management", path: "/user-management", roles: ["admin"] },
              { title: "System Settings", path: "/system-settings", roles: ["admin"] },
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
        { title: "Dashboard", path: "/analytics", roles: ["admin", "faculty"] },
        { title: "Performance", path: "/analytics/performance", roles: ["admin", "faculty"] },
        { title: "Reports", path: "/reports", roles: ["admin", "faculty"] },
      ],
    },
    {
      title: "Help",
      icon: "fas fa-question-circle",
      path: "/help",
      roles: ["admin", "faculty", "student"],
      submenu: [
        { title: "Help Center", path: "/help", roles: ["admin", "faculty", "student"] },
        { title: "FAQ", path: "/faq", roles: ["admin", "faculty", "student"] },
        { title: "Support", path: "/support", roles: ["admin", "faculty", "student"] },
      ],
    },
  ], [isAdmin]);

  const filteredItems = useMemo(
    () => navigationItems.filter((item) => item.roles.includes(userRole)),
    [navigationItems, userRole]
  );

  // Desktop nav item with dropdown
  const renderDesktopNavItem = (item) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = location.pathname === item.path || 
      (hasSubmenu && item.submenu.some(sub => location.pathname === sub.path));
    const isOpen = hoveredItem === item.title;

    return (
      <div 
        key={item.title}
        className="relative"
        onMouseEnter={() => handleMouseEnter(item.title)}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'inline-block' }}
      >
        <NavLink
          to={item.path}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            transition: 'all 0.2s',
            color: isActive ? colors.textActive : colors.text,
            backgroundColor: isActive ? colors.activeBg : 'transparent',
          }}
          onMouseOver={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = colors.hoverBg;
              e.currentTarget.style.color = colors.textActive;
            }
          }}
          onMouseOut={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.text;
            }
          }}
        >
          <i className={item.icon} style={{ marginRight: '8px', fontSize: '14px' }}></i>
          <span>{item.title}</span>
          {hasSubmenu && (
            <i 
              className="fas fa-chevron-down" 
              style={{ 
                marginLeft: '6px', 
                fontSize: '10px',
                transition: 'transform 0.2s',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            ></i>
          )}
        </NavLink>

        {/* Dropdown Menu */}
        {hasSubmenu && isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              paddingTop: '8px',
              width: '220px',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: colors.dropdownBg,
                borderRadius: '12px',
                boxShadow: colors.shadow,
                border: `1px solid ${colors.border}`,
                padding: '8px 0',
                overflow: 'hidden',
              }}
            >
              {item.submenu
                .filter((subItem) => subItem.roles.includes(userRole))
                .map((subItem, index) => {
                  const subIsActive = location.pathname === subItem.path;
                  return (
                    <NavLink
                      key={`${item.title}-${subItem.path}-${index}`}
                      to={subItem.path}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                        color: subIsActive ? colors.textActive : colors.text,
                        backgroundColor: subIsActive ? colors.activeBg : 'transparent',
                      }}
                      onMouseOver={(e) => {
                        if (!subIsActive) {
                          e.currentTarget.style.backgroundColor = colors.hoverBg;
                          e.currentTarget.style.color = colors.textActive;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!subIsActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.text;
                        }
                      }}
                    >
                      {subItem.title}
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
    const isActive = location.pathname === item.path || 
      (hasSubmenu && item.submenu.some(sub => location.pathname === sub.path));
    const isOpen = activeDropdown === item.title;

    if (hasSubmenu) {
      return (
        <div key={`mobile-${item.title}`} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
          <button
            onClick={() => toggleDropdown(item.title)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 16px',
              textAlign: 'left',
              border: 'none',
              backgroundColor: isActive ? colors.activeBg : 'transparent',
              color: isActive ? colors.textActive : colors.text,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <i className={item.icon} style={{ width: '20px', marginRight: '12px' }}></i>
              <span style={{ fontWeight: 500 }}>{item.title}</span>
            </div>
            <i 
              className="fas fa-chevron-down" 
              style={{ 
                fontSize: '10px',
                transition: 'transform 0.2s',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            ></i>
          </button>

          {isOpen && (
            <div style={{ backgroundColor: colors.mobileSubmenuBg, padding: '4px 0' }}>
              {item.submenu
                .filter((subItem) => subItem.roles.includes(userRole))
                .map((subItem, index) => {
                  const subIsActive = location.pathname === subItem.path;
                  return (
                    <NavLink
                      key={`mobile-${item.title}-${subItem.path}-${index}`}
                      to={subItem.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px 10px 48px',
                        fontSize: '14px',
                        textDecoration: 'none',
                        color: subIsActive ? colors.textActive : colors.textMuted,
                        backgroundColor: subIsActive ? colors.activeBg : 'transparent',
                      }}
                    >
                      {subItem.title}
                    </NavLink>
                  );
                })}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={`mobile-nav-${item.path}`}
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: `1px solid ${colors.borderLight}`,
          textDecoration: 'none',
          color: isActive ? colors.textActive : colors.text,
          backgroundColor: isActive ? colors.activeBg : 'transparent',
        }}
      >
        <i className={item.icon} style={{ width: '20px', marginRight: '12px' }}></i>
        <span style={{ fontWeight: 500 }}>{item.title}</span>
      </NavLink>
    );
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? colors.navBg : colors.navBgSolid,
        borderBottom: `1px solid ${colors.border}`,
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        boxShadow: isScrolled ? colors.navShadow : 'none',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 16px' }}>
        {/* Desktop Navigation - lg and above */}
        <div 
          className="hidden lg:flex"
          style={{ 
            display: 'none',
            alignItems: 'center', 
            height: '48px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {filteredItems.map((item) => renderDesktopNavItem(item))}
          </div>
        </div>

        {/* Tablet Navigation - md to lg */}
        <div 
          className="hidden md:flex lg:hidden"
          style={{ 
            display: 'none',
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '48px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, overflow: 'auto' }}>
            {filteredItems.slice(0, 6).map((item) => renderDesktopNavItem(item))}
          </div>
          
          {filteredItems.length > 6 && (
            <div style={{ position: 'relative', marginLeft: '8px' }}>
              <button
                onClick={() => toggleDropdown("more")}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.text,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <span>More</span>
                <i 
                  className="fas fa-chevron-down" 
                  style={{ 
                    marginLeft: '6px', 
                    fontSize: '10px',
                    transform: activeDropdown === "more" ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                ></i>
              </button>

              {activeDropdown === "more" && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '8px',
                    width: '220px',
                    backgroundColor: colors.dropdownBg,
                    borderRadius: '12px',
                    boxShadow: colors.shadow,
                    border: `1px solid ${colors.border}`,
                    padding: '8px 0',
                    zIndex: 9999,
                  }}
                >
                  {filteredItems.slice(6).map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 16px',
                        fontSize: '14px',
                        textDecoration: 'none',
                        color: colors.text,
                      }}
                    >
                      <i className={item.icon} style={{ width: '20px', marginRight: '12px' }}></i>
                      {item.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation - below md */}
        <div 
          className="flex md:hidden"
          style={{ 
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '48px',
          }}
        >
          <button
            onClick={toggleMobileMenu}
            data-mobile-toggle
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 12px',
              color: colors.text,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`} style={{ fontSize: '18px', marginRight: '8px' }}></i>
            <span style={{ fontWeight: 500, fontSize: '14px' }}>Menu</span>
          </button>

          <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textMuted, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {filteredItems.find((item) => 
              location.pathname === item.path || 
              item.submenu?.some(sub => location.pathname === sub.path)
            )?.title || "Navigation"}
          </span>

          <NavLink 
            to="/profile" 
            style={{ 
              padding: '8px', 
              color: colors.textMuted, 
              borderRadius: '6px',
              textDecoration: 'none',
            }}
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
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: colors.backdrop,
              zIndex: 40,
            }}
          />

          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="md:hidden"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: colors.mobileBg,
              boxShadow: colors.shadow,
              zIndex: 50,
              maxHeight: 'calc(100vh - 8rem)',
              overflowY: 'auto',
            }}
          >
            {/* User Info */}
            <div style={{ padding: '12px 16px', background: colors.userInfoBg, borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: colors.textDark, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || "User"}
                  </p>
                  <p style={{ fontSize: '12px', color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email || "user@email.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <div style={{ padding: '8px 0' }}>
              {filteredItems.map((item) => renderMobileNavItem(item))}
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.border}`, backgroundColor: colors.quickActionsBg }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <NavLink
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px', color: colors.textMuted, borderRadius: '8px', textDecoration: 'none' }}
                >
                  <i className="fas fa-user" style={{ fontSize: '18px', marginBottom: '4px' }}></i>
                  <span style={{ fontSize: '12px' }}>Profile</span>
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px', color: colors.textMuted, borderRadius: '8px', textDecoration: 'none' }}
                >
                  <i className="fas fa-cog" style={{ fontSize: '18px', marginBottom: '4px' }}></i>
                  <span style={{ fontSize: '12px' }}>Settings</span>
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px', color: colors.textMuted, borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  <i className="fas fa-sign-out-alt" style={{ fontSize: '18px', marginBottom: '4px' }}></i>
                  <span style={{ fontSize: '12px' }}>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CSS for responsive breakpoints */}
      <style>{`
        @media (min-width: 768px) {
          .hidden.md\\:flex { display: flex !important; }
          .flex.md\\:hidden { display: none !important; }
          .md\\:hidden { display: none !important; }
        }
        @media (min-width: 1024px) {
          .hidden.lg\\:flex { display: flex !important; }
          .hidden.md\\:flex.lg\\:hidden { display: none !important; }
        }
      `}</style>
    </nav>
  );
});

TopNav.displayName = "TopNav";

TopNav.propTypes = {
  isScrolled: PropTypes.bool,
};

export default TopNav;
