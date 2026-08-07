import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutGrid,
  FolderKanban,
  CalendarDays,
  BookOpen,
  User,
} from 'lucide-react';

/**
 * BottomNav Component
 *
 * Ultra-Premium Floating Bottom Navigation Bar for Mobile View (< 768px).
 * Features an expanding pill for the active tab (shows text) and icon-only
 * for inactive tabs. This perfectly resolves text overlap and feels like a native app.
 */
const BottomNav = memo(() => {
  const { user } = useAuth();
  const location = useLocation();

  const AUTH_PAGES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ];

  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  // Hide Bottom Navigation if user is not authenticated or on auth pages
  if (!user || isAuthPage) {
    return null;
  }

  const navItems = [
    {
      title: 'Home',
      path: '/dashboard',
      icon: LayoutGrid,
    },
    {
      title: 'Projects',
      path: '/projects',
      icon: FolderKanban,
    },
    {
      title: 'Meetings',
      path: '/meetings',
      icon: CalendarDays,
    },
    {
      title: 'Resources',
      path: '/resources',
      icon: BookOpen,
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: User,
    },
  ];

  const checkIsActive = (itemPath) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div
      className='block md:hidden fixed bottom-0 left-0 right-0 z-[100] pointer-events-none'
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      }}
    >
      <div className='mx-4 mb-4 pointer-events-auto flex justify-center'>
        <nav
          aria-label='Mobile Floating Navigation Dock'
          className='flex w-full max-w-[360px] items-center justify-between rounded-full border border-white/40 bg-white/80 p-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.path);

            return (
              <NavLink
                key={item.title}
                to={item.path}
                aria-label={item.title}
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-out active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 px-4 py-2.5 text-white shadow-md shadow-blue-500/30'
                    : 'p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`shrink-0 transition-all duration-300 ${
                    isActive ? 'h-5 w-5 stroke-[2.5]' : 'h-[22px] w-[22px] stroke-[1.75]'
                  }`}
                  aria-hidden='true'
                />
                
                {/* Expanding text for active state */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isActive ? 'ml-2 max-w-[80px] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  <span className='whitespace-nowrap text-[13px] font-bold tracking-wide'>
                    {item.title}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;
