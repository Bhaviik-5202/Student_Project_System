import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  FolderOpen,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * BottomNav Component
 * Fixed Bottom Navigation Bar for Mobile Viewports (< 768px).
 * Features active route highlights, Lucide React icons, safe-area inset support,
 * and seamless Light/Dark mode styling.
 */
const BottomNav = memo(() => {
  const location = useLocation();
  const { user } = useAuth();

  // Hide BottomNav on Auth pages
  const AUTH_PAGES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ];
  if (AUTH_PAGES.includes(location.pathname)) {
    return null;
  }

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban,
    },
    {
      name: 'Meetings',
      path: '/meetings',
      icon: CalendarDays,
    },
    {
      name: 'Resources',
      path: '/resources',
      icon: FolderOpen,
    },
    {
      name: user?.role === 'admin' ? 'Settings' : 'Profile',
      path: user?.role === 'admin' ? '/system-settings' : '/profile',
      icon: User,
    },
  ];

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 md:hidden'>
      <nav
        aria-label='Mobile Bottom Navigation'
        className='rounded-t-2xl sm:rounded-t-3xl border-t border-slate-200/90 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900/95 transition-colors duration-200'
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      >
        <div className='flex items-center justify-around px-2 pt-2'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' &&
                location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: linkIsActive }) => {
                  const active = isActive || linkIsActive;
                  return `group relative flex flex-1 flex-col items-center justify-center py-1 px-1 text-center transition-all duration-200 ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold'
                  }`;
                }}
              >
                {({ isActive: linkIsActive }) => {
                  const active = isActive || linkIsActive;
                  return (
                    <>
                      <div
                        className={`flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                          active
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 scale-105 shadow-xs'
                            : 'group-active:scale-95'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 transition-transform duration-200 ${
                            active
                              ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5]'
                              : 'text-slate-500 dark:text-slate-400 stroke-[1.75]'
                          }`}
                        />
                      </div>
                      <span className='mt-0.5 text-[10px] tracking-tight truncate max-w-[64px]'>
                        {item.name}
                      </span>
                    </>
                  );
                }}
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
