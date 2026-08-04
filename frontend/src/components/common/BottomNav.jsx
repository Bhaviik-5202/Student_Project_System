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
 * Apple-grade Floating Bottom Navigation Bar for Mobile View (< 768px).
 * Features glassmorphism backdrop, active pill highlight, safe-area inset,
 * and high-end touch feedback transitions.
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
      title: 'Dashboard',
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
    <div className='block md:hidden fixed bottom-3 left-3 right-3 z-50 pointer-events-auto max-w-sm mx-auto select-none'>
      <nav
        aria-label='Mobile Floating Navigation Dock'
        className='relative w-full rounded-[24px] border border-white/60 bg-white/85 p-1.5 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.14)] dark:border-slate-800/80 dark:bg-slate-900/85 dark:shadow-[0_14px_40px_rgba(0,0,0,0.6)]'
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.2rem)',
        }}
      >
        <div className='flex items-center justify-between gap-1 h-12'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.path);

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={`relative flex flex-1 flex-col items-center justify-center h-full py-1 rounded-xl transition-all duration-200 active:scale-90 ${isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                {/* Icon */}
                <Icon
                  className={`h-4.5 w-4.5 transition-transform duration-200 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'
                    }`}
                />

                {/* Title Label */}
                <span
                  className={`mt-0.5 text-[10px] leading-tight tracking-tight truncate max-w-full ${isActive ? 'font-bold text-white' : 'font-semibold'
                    }`}
                >
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;
