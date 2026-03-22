import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { navigationItems } from '../../config/navigation';

/**
 * TopNav Component
 *
 * Secondary horizontal navigation bar providing access to module-specific
 * sub-routes. Features role-based visibility and fluid dropdown menus
 * for advanced navigation.
 */
const TopNav = memo(
  ({
    isScrolled = false,
    isMobileMenuOpen = false,
    onMobileMenuToggle,
    onCloseMobileMenu,
  }) => {
    const location = useLocation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const navRef = useRef(null);
    const dropdownTimeoutRef = useRef(null);

    const colors = useMemo(
      () => ({
        navBg: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        navBgSolid: isDark ? '#111827' : '#ffffff',
        dropdownBg: isDark ? '#1f2937' : '#ffffff',
        border: isDark ? '#374151' : '#e5e7eb',
        borderLight: isDark ? '#4b5563' : '#f3f4f6',
        text: isDark ? '#f3f4f6' : '#374151',
        textMuted: isDark ? '#9ca3af' : '#6b7280',
        textActive: '#3b82f6',
      }),
      [isDark]
    );

    const userRole = useMemo(() => user?.role || 'student', [user?.role]);

    useEffect(() => {
      onCloseMobileMenu?.();
      setActiveDropdown(null);
    }, [location.pathname, onCloseMobileMenu]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (navRef.current && !navRef.current.contains(e.target)) {
          setActiveDropdown(null);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseEnter = useCallback((title) => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      setHoveredItem(title);
      setActiveDropdown(title);
    }, []);

    const handleMouseLeave = useCallback(() => {
      dropdownTimeoutRef.current = setTimeout(() => {
        setHoveredItem(null);
        setActiveDropdown(null);
      }, 150);
    }, []);

    const filteredItems = useMemo(
      () => navigationItems.filter((item) => item.roles.includes(userRole)),
      [userRole]
    );

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
          className='relative'
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
        >
          {hasSubmenu ? (
            <button
              onClick={() =>
                setActiveDropdown((prev) =>
                  prev === item.title ? null : item.title
                )
              }
              className={`group inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700/50'}`}
              style={{ color: isActive ? colors.textActive : colors.text }}
            >
              <i className={`fas fa-${item.icon} mr-2 text-sm`}></i>
              <span>{item.title}</span>
              <i
                className={`fas fa-chevron-down ml-2 text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              ></i>
            </button>
          ) : (
            <NavLink
              to={item.path}
              className={`group inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700/50'}`}
              style={{ color: isActive ? colors.textActive : colors.text }}
            >
              <i className={`fas fa-${item.icon} mr-2 text-sm`}></i>
              <span>{item.title}</span>
            </NavLink>
          )}

          {hasSubmenu && isOpen && (
            <div className='animate-dropdown absolute left-0 top-full z-[9999] w-60 pt-2'>
              <div className='absolute -top-2 left-0 right-0 h-4' />
              <div
                className='rounded-xl border py-2 shadow-2xl backdrop-blur-sm'
                style={{
                  backgroundColor: colors.dropdownBg,
                  borderColor: colors.border,
                }}
              >
                {item.submenu
                  .filter((sub) => sub.roles.includes(userRole))
                  .map((subItem, idx) => {
                    const subIsActive = location.pathname === subItem.path;
                    return (
                      <NavLink
                        key={`${item.title}-${idx}`}
                        to={subItem.path}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-blue-50 hover:pl-5 dark:hover:bg-blue-900/20 ${subIsActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${subIsActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        />
                        <span className='font-medium'>{subItem.title}</span>
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 top-16 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md backdrop-blur-md' : ''}`}
        style={{
          backgroundColor: isScrolled ? colors.navBg : colors.navBgSolid,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className='w-full px-4 lg:px-6'>
          <div className='hidden h-14 items-center gap-0.5 lg:flex'>
            {filteredItems.map(renderDesktopNavItem)}
          </div>

          {/* Mobile Header indicator */}
          <div className='flex h-12 items-center justify-between lg:hidden'>
            <button
              onClick={onMobileMenuToggle}
              className='inline-flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            >
              <i
                className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} mr-2`}
              ></i>
              <span className='text-sm font-medium'>Menu</span>
            </button>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              {filteredItems.find((i) => location.pathname.startsWith(i.path))
                ?.title || 'Navigation'}
            </span>
            <NavLink
              to='/profile'
              className='p-2 text-gray-500 hover:text-blue-500'
            >
              <i className='fas fa-user'></i>
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }
);

TopNav.displayName = 'TopNav';

TopNav.propTypes = {
  isScrolled: PropTypes.bool,
  isMobileMenuOpen: PropTypes.bool,
  onMobileMenuToggle: PropTypes.func,
  onCloseMobileMenu: PropTypes.func,
};

export default TopNav;
