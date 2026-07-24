import { Link } from 'react-router-dom';
import HeaderIcon from './HeaderIcon';

/**
 * NotificationMenu Component
 *
 * A sophisticated dropdown menu for displaying user-specific
 * system alerts. Features read/unread state management, bulk
 * dismissal actions, and direct links to the full notification center.
 */
const NotificationMenu = ({
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onClose,
}) => {
  return (
    <>
      <div className='border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
            <HeaderIcon name='bell' className='text-blue-500' size='text-sm' />
            Notifications
          </h3>
          <div className='flex items-center gap-3'>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className='text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
              >
                Mark all read
              </button>
            )}
            <Link
              to='/notifications'
              onClick={onClose}
              className='text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700  dark:hover:text-gray-300'
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className='max-h-80 overflow-y-auto'>
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`cursor-pointer border-l-4 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700/50 ${
                notification.read
                  ? 'border-transparent'
                  : 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
              }`}
            >
              <div className='flex items-start gap-3'>
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${notification.bgColor}`}
                >
                  <HeaderIcon
                    name={notification.icon}
                    className={notification.color}
                    size='text-sm'
                  />
                </div>
                <div className='min-w-0 flex-1'>
                  <p
                    className={`text-sm font-medium ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}
                  >
                    {notification.title}
                  </p>
                  <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className='mt-1 flex-shrink-0'>
                    <div className='h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500'></div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='px-4 py-8 text-center'>
            <HeaderIcon
              name='bell-slash'
              className='mb-2 text-gray-300 dark:text-gray-600 dark:text-gray-300'
              size='text-3xl'
            />
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              No new notifications
            </p>
          </div>
        )}
      </div>

      <div className='border-t border-gray-100 px-4 py-3 dark:border-gray-700'>
        <Link
          to='/notifications'
          onClick={onClose}
          className='flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
        >
          View all notifications
          <HeaderIcon name='arrow-right' size='text-xs' />
        </Link>
      </div>
    </>
  );
};

export default NotificationMenu;
