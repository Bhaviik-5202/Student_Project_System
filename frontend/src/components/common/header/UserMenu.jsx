import { Link } from 'react-router-dom';
import HeaderIcon from './HeaderIcon';

/**
 * UserMenu Component
 *
 * An advanced user identity and navigation hub. Displays profile
 * metadata, provides quick links to personal settings and admin panels,
 * and handles secure session termination.
 */
const UserMenu = ({ user, initials, onLogout, onClose }) => {
  return (
    <div className='py-2'>
      {/* User Info Header */}
      <div className='border-b border-gray-100 px-4 py-4 dark:border-gray-700'>
        <div className='flex items-center gap-3'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25'>
            <span className='text-xl font-bold text-white'>{initials}</span>
          </div>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-base font-bold text-gray-900 dark:text-white'>
              {user?.name || 'User'}
            </p>
            <p className='truncate text-sm text-gray-500 dark:text-gray-400'>
              {user?.email || 'user@example.com'}
            </p>
            <span className='mt-1.5 inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'>
              <HeaderIcon name='shield-halved' size='text-[10px]' />
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className='py-2'>
        {[
          { icon: 'gauge-high', label: 'Dashboard', path: '/dashboard' },
          { icon: 'user', label: 'My Profile', path: '/profile' },
          { icon: 'gear', label: 'Settings', path: '/settings' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className='group flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-blue-400'
          >
            <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition-colors group-hover:bg-blue-100 dark:bg-gray-700 dark:group-hover:bg-blue-900/40'>
              <HeaderIcon
                name={item.icon}
                className='text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400'
                size='text-sm'
              />
            </div>
            <span className='font-medium'>{item.label}</span>
          </Link>
        ))}

        {user?.role === 'admin' && (
          <Link
            to='/admin-dashboard'
            onClick={onClose}
            className='group flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-blue-400'
          >
            <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition-colors group-hover:bg-blue-100 dark:bg-gray-700 dark:group-hover:bg-blue-900/40'>
              <HeaderIcon
                name='shield-halved'
                className='text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400'
                size='text-sm'
              />
            </div>
            <span className='font-medium'>Admin Panel</span>
          </Link>
        )}

        <div className='mx-4 my-2 border-t border-gray-100 dark:border-gray-700'></div>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className='group flex w-full items-center px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
        >
          <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 transition-colors group-hover:bg-red-100 dark:bg-red-900/30 dark:group-hover:bg-red-900/50'>
            <HeaderIcon
              name='right-from-bracket'
              className='text-red-500'
              size='text-sm'
            />
          </div>
          <span className='font-medium'>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
