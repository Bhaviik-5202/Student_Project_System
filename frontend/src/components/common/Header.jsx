import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNotificationsContext } from '../../context/NotificationContext';
import Calendar from '../ui/Calendar';
import HeaderIcon from './header/HeaderIcon';
import SearchBar from './header/SearchBar';
import NotificationMenu from './header/NotificationMenu';
import UserMenu from './header/UserMenu';
import QuickAddMenu from './header/QuickAddMenu';

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
    clearNotifications = () => { },
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

    // Global notifications context
    const { notifications, unreadCount, markAllAsRead, deleteNotification } = useNotificationsContext();

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

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') closeAllDropdowns();
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          setShowSearch(true);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeAllDropdowns]);

    // Close on route change
    useEffect(() => {
      closeAllDropdowns();
    }, [location.pathname, closeAllDropdowns]);

    const getRoleLabel = useCallback(() => {
      const roles = {
        admin: 'Administrator',
        faculty: 'Faculty Member',
        student: 'Student',
      };
      return roles[user?.role] || 'User';
    }, [user?.role]);

    const getUserInitials = useCallback(() => {
      if (!user?.name) return 'U';
      const parts = user.name.split(' ');
      return (parts[0][0] + (parts[1] ? parts[1][0] : ''))
        .toUpperCase()
        .slice(0, 2);
    }, [user?.name]);

    const getPageTitle = useCallback(() => {
      const path = location.pathname.split('/').pop();
      if (!path || path === 'dashboard') return 'Dashboard';

      const titles = {
        projects: 'Projects',
        students: 'Students',
        meetings: 'Meetings',
        reports: 'Reports',
        profile: 'Profile',
        settings: 'Settings',
      };

      return (
        titles[path] ||
        path.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      );
    }, [location.pathname]);

    const quickAddActions = useMemo(() => {
      if (user?.role === 'admin') {
        return [
          {
            icon: 'diagram-project',
            label: 'New Project Architecture',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/40',
            path: '/project-types',
          },
          {
            icon: 'user-plus',
            label: 'Add System User',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100 dark:bg-indigo-900/40',
            path: '/user-management/new',
          },
          {
            icon: 'calendar-plus',
            label: 'Schedule Meeting',
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/40',
            path: '/meetings/new',
          },
          {
            icon: 'gear',
            label: 'System Settings',
            color: 'text-amber-600',
            bgColor: 'bg-amber-100 dark:bg-amber-900/40',
            path: '/system-settings',
          },
        ];
      }

      if (user?.role === 'faculty') {
        return [
          {
            icon: 'plus',
            label: 'New Student Project',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/40',
            path: '/projects/new',
          },
          {
            icon: 'calendar-plus',
            label: 'Schedule Consultation',
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/40',
            path: '/meetings/new',
          },
          {
            icon: 'file-arrow-up',
            label: 'Upload Resource',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
            path: '/resource-upload',
          },
        ];
      }

      // Student quick links
      return [
        {
          icon: 'diagram-project',
          label: 'My Assigned Project',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900/40',
          path: '/projects',
        },
        {
          icon: 'calendar-days',
          label: 'My Meetings',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100 dark:bg-indigo-900/40',
          path: '/meetings',
        },
        {
          icon: 'folder-open',
          label: 'Browse Resources',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
          path: '/resources',
        },
      ];
    }, [user?.role]);

    const handleQuickAction = useCallback(
      (path) => {
        setShowQuickAdd(false);
        navigate(path);
      },
      [navigate]
    );

    const Dropdown = ({ isOpen, children, className = '' }) => {
      if (!isOpen) return null;
      return (
        <div
          className={`dropdown-enter absolute right-0 top-full z-[9999] mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-slate-900 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:w-80 ${className}`}
        >
          {children}
        </div>
      );
    };

    return (
      <>
        <header
          className={`sticky top-0 z-[100] h-16 w-full bg-white dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 dark:bg-gray-900/95 ${isScrolled ? 'shadow-lg dark:shadow-gray-800/50' : 'border-b border-gray-200/80 dark:border-gray-700/80'}`}
        >
          <div className='h-full w-full px-4 lg:px-6'>
            <div className='flex h-full items-center justify-between gap-4'>
              {/* Logo Section */}
              <div className='flex items-center gap-3'>
                <button
                  onClick={onMobileMenuToggle}
                  className='rounded-xl p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800  dark:hover:bg-gray-800 lg:hidden'
                  aria-label='Toggle mobile menu'
                >
                  <HeaderIcon
                    name={isMobileMenuOpen ? 'xmark' : 'bars'}
                    size='text-xl'
                  />
                </button>
                <Link to='/dashboard' className='group flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg'>
                    <HeaderIcon
                      name='graduation-cap'
                      className='text-white'
                      size='text-lg'
                    />
                  </div>
                  <div className='hidden sm:block'>
                    <h1 className='text-base font-bold leading-tight text-gray-900 dark:text-white'>
                      Student Project System
                    </h1>
                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                      {getPageTitle()}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-1 sm:gap-2'>
                <button
                  onClick={() => setShowSearch(true)}
                  className='rounded-xl p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800  dark:hover:bg-gray-800 lg:hidden'
                  aria-label='Search'
                >
                  <HeaderIcon name='magnifying-glass' size='text-lg' />
                </button>

                {user?.role === 'admin' && (
                  <div className='relative hidden md:block' ref={quickAddRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setShowQuickAdd(!showQuickAdd);
                      }}
                      className={`rounded-xl p-2.5 transition-all ${showQuickAdd ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800  dark:hover:bg-gray-800'}`}
                      aria-label='Quick Actions'
                    >
                      <HeaderIcon name='plus' size='text-lg' />
                    </button>
                    <Dropdown isOpen={showQuickAdd} className='w-60'>
                      <QuickAddMenu
                        actions={quickAddActions}
                        onActionClick={handleQuickAction}
                      />
                    </Dropdown>
                  </div>
                )}

                <div className='relative hidden md:block' ref={calendarRef}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowCalendar(!showCalendar);
                    }}
                    className={`rounded-xl p-2.5 transition-all ${showCalendar ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800  dark:hover:bg-gray-800'}`}
                    aria-label='Calendar'
                  >
                    <HeaderIcon name='calendar-days' size='text-lg' />
                  </button>
                  {showCalendar && (
                    <div className='animate-dropdown absolute right-0 top-full z-50 mt-2'>
                      <Calendar
                        onDateClick={(date) => {
                          setShowCalendar(false);
                          navigate(
                            `/meetings?date=${date.toISOString().split('T')[0]}`
                          );
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleTheme}
                  className='flex rounded-xl p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800  dark:hover:bg-gray-800'
                  aria-label='Toggle theme'
                >
                  <HeaderIcon
                    name={isDarkMode ? 'sun' : 'moon'}
                    size='text-lg'
                  />
                </button>

                <div className='relative' ref={notificationsRef}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowNotifications(!showNotifications);
                    }}
                    className={`relative rounded-xl p-2.5 transition-all ${showNotifications ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800  dark:hover:bg-gray-800'}`}
                    aria-label='Notifications'
                  >
                    <HeaderIcon name='bell' size='text-lg' />
                    {unreadCount > 0 && (
                      <span className='absolute -right-0.5 -top-0.5 flex h-5 w-5'>
                        <span className='relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm'>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </span>
                    )}
                  </button>
                  <Dropdown isOpen={showNotifications} className='w-80 sm:w-96'>
                    <NotificationMenu
                      notifications={notifications}
                      unreadCount={unreadCount}
                      onMarkAllAsRead={() => {
                        markAllAsRead();
                        setShowNotifications(false);
                      }}
                      onClose={() => setShowNotifications(false)}
                      onDelete={deleteNotification}
                    />
                  </Dropdown>
                </div>

                <div className='relative' ref={userMenuRef}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className='flex items-center gap-3 rounded-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/50 dark:hover:bg-gray-800'
                  >
                    <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg sm:h-10 sm:w-10'>
                      <span className='text-sm font-bold text-white'>
                        {getUserInitials()}
                      </span>
                    </div>
                    <div className='hidden text-left lg:block'>
                      <p className='max-w-[100px] truncate text-sm font-semibold text-gray-900 dark:text-white'>
                        {user?.name || 'User'}
                      </p>
                      <p className='max-w-[100px] truncate text-xs text-gray-500 dark:text-gray-400'>
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
            className='fixed inset-0 z-[200] flex items-start justify-center bg-black/60 px-4 pt-16 backdrop-blur-sm'
            onClick={(e) =>
              e.target === e.currentTarget && setShowSearch(false)
            }
          >
            <div className='animate-dropdown w-full max-w-lg rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
                  <HeaderIcon
                    name='magnifying-glass'
                    className='text-blue-500'
                    size='text-sm'
                  />
                  Search
                </h3>
                <button
                  onClick={() => setShowSearch(false)}
                  className='rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 '
                >
                  <HeaderIcon name='xmark' size='text-lg' />
                </button>
              </div>
              <SearchBar
                onSearch={(q) => {
                  setShowSearch(false);
                }}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </>
    );
  }
);

Header.displayName = 'Header';

Header.propTypes = {
  isScrolled: PropTypes.bool,
  notificationCount: PropTypes.number,
  clearNotifications: PropTypes.func,
  onMobileMenuToggle: PropTypes.func,
  isMobileMenuOpen: PropTypes.bool,
};

export default Header;
