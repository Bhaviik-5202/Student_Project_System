import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { navigationItems } from '../../config/navigation';

/**
 * Submenu Icon Mapping
 * Provides clean visual identifiers for sub-navigation items
 */
const SUBMENU_ICONS = {
  'All Projects': 'th-large',
  'Project Proposal': 'plus-circle',
  'Project Groups': 'users',
  'Guide Allocation': 'user-tag',
  Timeline: 'stream',
  Milestones: 'flag-checkered',
  'Student List': 'user-graduate',
  Calendar: 'calendar-alt',
  'Meeting List': 'list-ul',
  'Schedule Meeting': 'plus',
  'Browse Resources': 'folder-open',
  'Document Library': 'file-alt',
  Templates: 'copy',
  'Admin Dashboard': 'chart-pie',
  'User Management': 'user-cog',
  'Staff Management': 'id-badge',
  'System Settings': 'sliders-h',
  'Audit Log': 'shield-alt',
  Dashboard: 'chart-line',
  Performance: 'tachometer-alt',
  Reports: 'file-invoice',
  'Help Center': 'life-ring',
  FAQ: 'question-circle',
};

/**
 * TopNav Component
 *
 * Secondary horizontal navigation bar providing access to module-specific
 * sub-routes. Features role-based visibility, rich dropdown menus,
 * active path indicators, and responsive mobile navigation.
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
    const [expandedMobileItem, setExpandedMobileItem] = useState(null);
    const navRef = useRef(null);
    const dropdownTimeoutRef = useRef(null);

    const userRole = useMemo(() => user?.role || 'student', [user?.role]);

    // Filter navigation items based on user role
    const filteredItems = useMemo(
      () => navigationItems.filter((item) => item.roles.includes(userRole)),
      [userRole]
    );

    // Find currently active nav item
    const currentActiveItem = useMemo(() => {
      return filteredItems.find(
        (item) =>
          location.pathname === item.path ||
          (item.submenu &&
            item.submenu.some((sub) => location.pathname === sub.path))
      );
    }, [filteredItems, location.pathname]);

    // Find currently active submenu title
    const currentActiveSubTitle = useMemo(() => {
      if (!currentActiveItem?.submenu) return null;
      const match = currentActiveItem.submenu.find(
        (sub) => location.pathname === sub.path
      );
      return match ? match.title : null;
    }, [currentActiveItem, location.pathname]);

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
      }, 180);
    }, []);

    const toggleMobileSubmenu = useCallback((title) => {
      setExpandedMobileItem((prev) => (prev === title ? null : title));
    }, []);

    const renderDesktopNavItem = (item) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isActive =
        location.pathname === item.path ||
        (hasSubmenu &&
          item.submenu.some((sub) => location.pathname === sub.path));
      const isOpen =
        hoveredItem === item.title || activeDropdown === item.title;

      const visibleSubmenu = hasSubmenu
        ? item.submenu.filter((sub) => sub.roles.includes(userRole))
        : [];

      return (
        <div
          key={item.title}
          className='relative'
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
        >
          {hasSubmenu ? (
            <button
              type='button'
              aria-haspopup='true'
              aria-expanded={isOpen}
              onClick={() =>
                setActiveDropdown((prev) =>
                  prev === item.title ? null : item.title
                )
              }
              className={`group relative inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800/80 hover:text-indigo-600  dark:hover:bg-slate-800/80 dark:hover:text-indigo-400'
              }`}
            >
              <i
                className={`fas fa-${item.icon} text-sm transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 group-hover:text-indigo-500'
                }`}
              />
              <span>{item.title}</span>
              <i
                className={`fas fa-chevron-down text-xs opacity-70 transition-transform duration-200 ${
                  isOpen
                    ? 'rotate-180 text-indigo-600 dark:text-indigo-400'
                    : ''
                }`}
              />
              {isActive && (
                <span className='absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-indigo-600 dark:bg-indigo-400' />
              )}
            </button>
          ) : (
            <NavLink
              to={item.path}
              className={`group relative inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800/80 hover:text-indigo-600  dark:hover:bg-slate-800/80 dark:hover:text-indigo-400'
              }`}
            >
              <i
                className={`fas fa-${item.icon} text-sm transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 group-hover:text-indigo-500'
                }`}
              />
              <span>{item.title}</span>
              {isActive && (
                <span className='absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-indigo-600 dark:bg-indigo-400' />
              )}
            </NavLink>
          )}

          {/* Submenu Dropdown Popover */}
          {hasSubmenu && isOpen && visibleSubmenu.length > 0 && (
            <div className='animate-in fade-in slide-in-from-top-1 duration-150 absolute left-0 top-full z-[9999] min-w-[230px] pt-1.5'>
              <div className='rounded-2xl border border-slate-200/90 bg-white dark:bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 '>
                <div className='mb-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between'>
                  <span>{item.title} Options</span>
                  <span className='rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'>
                    {visibleSubmenu.length}
                  </span>
                </div>
                <div className='space-y-0.5'>
                  {visibleSubmenu.map((subItem, idx) => {
                    const subIsActive = location.pathname === subItem.path;
                    const subIcon =
                      SUBMENU_ICONS[subItem.title] || 'angle-right';

                    return (
                      <NavLink
                        key={`${item.title}-${idx}`}
                        to={subItem.path}
                        className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                          subIsActive
                            ? 'bg-indigo-50/90 text-indigo-600 font-semibold dark:bg-indigo-950/70 dark:text-indigo-400'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800/80 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-indigo-400'
                        }`}
                      >
                        <div className='flex items-center gap-2.5'>
                          <i
                            className={`fas fa-${subIcon} text-xs w-4 text-center ${
                              subIsActive
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-400 group-hover:text-indigo-500'
                            }`}
                          />
                          <span>{subItem.title}</span>
                        </div>
                        {subIsActive && (
                          <span className='h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400' />
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <nav
        ref={navRef}
        aria-label='Secondary Navigation'
        className={`sticky top-0 z-[90] border-b transition-all duration-300 hidden md:block ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md border-slate-200/90 dark:bg-slate-900/90 dark:border-slate-800/90'
            : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
        }`}
      >
        <div className='w-full px-4 lg:px-6'>
          {/* Desktop Top Navigation Bar */}
          <div className='flex h-12 w-full items-center justify-between'>
            <div className='flex items-center gap-1.5 justify-start'>
              {filteredItems.map(renderDesktopNavItem)}
            </div>

            {/* Active Route / Section Indicator Badge */}
            {currentActiveItem && (
              <div className='flex shrink-0 whitespace-nowrap items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-slate-200'>
                <i
                  className={`fas fa-${currentActiveItem.icon} text-xs text-indigo-500 dark:text-indigo-400`}
                />
                <span>{currentActiveItem.title}</span>
                {currentActiveSubTitle && (
                  <>
                    <i className='fas fa-chevron-right text-[9px] text-slate-400' />
                    <span className='font-extrabold text-indigo-600 dark:text-indigo-400'>
                      {currentActiveSubTitle}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Header Bar */}
          <div className='flex h-12 items-center justify-between lg:hidden'>
            <button
              type='button'
              onClick={onMobileMenuToggle}
              className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700  dark:border-slate-700   '
            >
              <i
                className={`fas ${
                  isMobileMenuOpen ? 'fa-times' : 'fa-bars'
                } text-sm text-indigo-600 dark:text-indigo-400`}
              />
              <span>Navigation</span>
            </button>

            {currentActiveItem && (
              <div className='truncate text-sm font-bold text-indigo-600 dark:text-indigo-400'>
                {currentActiveItem.title}
                {currentActiveSubTitle ? ` › ${currentActiveSubTitle}` : ''}
              </div>
            )}
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
