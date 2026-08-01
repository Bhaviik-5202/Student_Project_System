import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  FolderKanban,
  CalendarDays,
  FolderOpen,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * BottomNav Component
 * Premium Glassmorphic Floating Pill Bottom Navigation Bar for Mobile Viewports (< 768px).
 * Features active pill indicators, blur background, safe-area support, and smooth touch scale animations.
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
      icon: LayoutGrid,
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
      name: 'Profile',
      path: user?.role === 'admin' ? '/system-settings' : '/profile',
      icon: User,
    },
  ];

  return (
    <div className='fixed bottom-3 left-3.5 right-3.5 sm:left-5 sm:right-5 z-50 md:hidden'>
      <nav
        aria-label='Mobile Bottom Navigation'
        className='rounded-3xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 py-1.5 px-2'
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
        <div className='flex items-center justify-around'>
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
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold'
                  }`;
                }}
              >
                {({ isActive: linkIsActive }) => {
                  const active = isActive || linkIsActive;
                  return (
                    <>
                      <div
                        className={`flex h-8 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-950/70 scale-105 shadow-xs'
                            : 'group-active:scale-95'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 transition-transform duration-200 ${
                            active
                              ? 'text-blue-600 dark:text-blue-400 stroke-[2.5]'
                              : 'text-slate-400 dark:text-slate-500 stroke-[1.75]'
                          }`}
                        />
                      </div>
                      <span className='text-[10px] font-semibold tracking-tight truncate max-w-[64px] mt-0.5'>
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
