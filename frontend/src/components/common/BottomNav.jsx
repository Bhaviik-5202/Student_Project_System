import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Folder,
  FileBarChart,
  Bell,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * BottomNav Component
 * Fixed Floating Pill Bottom Navigation Bar for Mobile Viewports (< 768px).
 * Matches reference UI: Dashboard (Grid), Projects (Folder), Reports (Chart), Alerts (Bell), Profile (User).
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
      icon: Folder,
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: FileBarChart,
    },
    {
      name: 'Alerts',
      path: '/notifications',
      icon: Bell,
    },
    {
      name: 'Profile',
      path: user?.role === 'admin' ? '/system-settings' : '/profile',
      icon: User,
    },
  ];

  return (
    <div className='fixed bottom-2.5 left-3 right-3 sm:left-4 sm:right-4 z-50 md:hidden'>
      <nav
        aria-label='Mobile Bottom Navigation'
        className='rounded-3xl border border-slate-200/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl dark:border-slate-800 transition-all duration-200 py-1.5 px-2'
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
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                  }`;
                }}
              >
                {({ isActive: linkIsActive }) => {
                  const active = isActive || linkIsActive;
                  return (
                    <>
                      <div className='flex h-7 w-7 items-center justify-center transition-transform duration-200 group-active:scale-90'>
                        <Icon
                          className={`h-5 w-5 transition-all duration-200 ${
                            active
                              ? 'text-blue-600 dark:text-blue-400 stroke-[2.5]'
                              : 'text-slate-400 dark:text-slate-500 stroke-[1.75]'
                          }`}
                        />
                      </div>
                      <span className='text-[11px] font-semibold tracking-tight truncate max-w-[64px] mt-0.5'>
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
