import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  BellOff,
  ArrowRight,
} from 'lucide-react';

/**
 * NotificationMenu Component
 *
 * A sophisticated dropdown menu for displaying user-specific
 * system alerts. Features read/unread state management, bulk
 * dismissal actions, and direct links to the full notification center.
 */
const getNotificationStyle = (type) => {
  switch (type) {
    case 'success':
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/40',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/40',
      };
    case 'error':
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/40',
      };
    case 'info':
    default:
      return {
        icon: Bell,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/40',
      };
  }
};

const formatTime = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const NotificationMenu = ({
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onClose,
  onDelete,
}) => {
  return (
    <>
      <div className='border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
            <Bell className='h-4 w-4 text-blue-500' aria-hidden='true' />
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
              onClick={() => {
                if (unreadCount > 0 && onMarkAllAsRead) onMarkAllAsRead();
                if (onClose) onClose();
              }}
              className='text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700  dark:hover:text-gray-300'
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className='max-h-80 overflow-y-auto'>
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => {
            const style = getNotificationStyle(notification.type);
            return (
              <div
                key={notification._id || notification.id}
                className={`group/notifitem cursor-pointer border-l-4 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700/50 ${
                  notification.read
                    ? 'border-transparent'
                    : 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${style.bgColor}`}
                  >
                    <style.icon
                      className={`h-4 w-4 ${style.color}`}
                      aria-hidden='true'
                    />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p
                      className={`text-sm font-medium ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}
                    >
                      {notification.message || notification.title}
                    </p>
                    <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                      {formatTime(notification.createdAt || notification.time)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className='mt-1 flex-shrink-0'>
                      <div className='h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500'></div>
                    </div>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification._id || notification.id);
                      }}
                      className='mt-0.5 opacity-0 transition-opacity hover:text-red-500 group-hover/notifitem:opacity-100'
                      title='Delete notification'
                    >
                      <Trash2
                        className='h-4 w-4 text-gray-400 hover:text-red-500'
                        aria-hidden='true'
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className='px-4 py-8 text-center'>
            <BellOff
              className='mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600'
              aria-hidden='true'
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
          onClick={() => {
            if (unreadCount > 0 && onMarkAllAsRead) onMarkAllAsRead();
            if (onClose) onClose();
          }}
          className='flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
        >
          View all notifications
          <ArrowRight className='h-3 w-3' aria-hidden='true' />
        </Link>
      </div>
    </>
  );
};

export default NotificationMenu;
