// src/components/pages/dashboard/NotificationCenter.jsx
import { memo, useState, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

// Constants for notification types
const NOTIFICATION_TYPES = {
  assignment: {
    icon: 'fa-tasks',
    color:
      'text-amber-600 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-900 dark:border-amber-700',
    label: 'Assignment',
  },
  grade: {
    icon: 'fa-graduation-cap',
    color:
      'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900 dark:border-emerald-700',
    label: 'Grade',
  },
  announcement: {
    icon: 'fa-bullhorn',
    color:
      'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900 dark:border-blue-700',
    label: 'Announcement',
  },
  meeting: {
    icon: 'fa-calendar-alt',
    color:
      'text-purple-600 bg-purple-100 border-purple-200 dark:text-purple-400 dark:bg-purple-900 dark:border-purple-700',
    label: 'Meeting',
  },
  student: {
    icon: 'fa-user-graduate',
    color:
      'text-indigo-600 bg-indigo-100 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-900 dark:border-indigo-700',
    label: 'Student',
  },
  approval: {
    icon: 'fa-check-circle',
    color:
      'text-teal-600 bg-teal-100 border-teal-200 dark:text-teal-400 dark:bg-teal-900 dark:border-teal-700',
    label: 'Approval',
  },
  alert: {
    icon: 'fa-exclamation-triangle',
    color:
      'text-rose-600 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-900 dark:border-rose-700',
    label: 'Alert',
  },
  default: {
    icon: 'fa-bell',
    color:
      'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-700 dark:border-slate-600',
    label: 'Notification',
  },
};

const NotificationCenter = memo(
  ({ notifications = [], onNotificationClick, onMarkAllAsRead }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filter, setFilter] = useState('all'); // "all", "unread", "read"

    // Memoized calculations
    const unreadCount = useMemo(
      () => notifications.filter((n) => !n.read).length,
      [notifications]
    );

    const filteredNotifications = useMemo(() => {
      if (filter === 'all') return notifications;
      if (filter === 'unread') return notifications.filter((n) => !n.read);
      return notifications.filter((n) => n.read);
    }, [notifications, filter]);

    const displayedNotifications = useMemo(() => {
      const filtered = filteredNotifications;
      return isExpanded ? filtered : filtered.slice(0, 3);
    }, [filteredNotifications, isExpanded]);

    // Handler functions
    const handleNotificationClick = useCallback(
      (id) => {
        if (onNotificationClick) {
          onNotificationClick(id);
        }
      },
      [onNotificationClick]
    );

    const handleMarkAllAsRead = useCallback(() => {
      if (onMarkAllAsRead) {
        onMarkAllAsRead();
        toast.success('All notifications marked as read');
      }
    }, [onMarkAllAsRead]);

    const handleClearAll = useCallback(() => {
      toast((t) => (
        <div className='flex flex-col'>
          <p className='font-medium'>Clear all notifications?</p>
          <div className='mt-2 flex gap-2'>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.success('All notifications cleared');
              }}
              className='rounded bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-700'
            >
              Clear All
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className='rounded bg-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            >
              Cancel
            </button>
          </div>
        </div>
      ));
    }, []);

    const getNotificationConfig = (type) => {
      return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.default;
    };

    const formatRelativeTime = (timeString) => {
      const units = {
        'h ago': 3600000,
        'm ago': 60000,
        'd ago': 86400000,
      };

      for (const [unit, ms] of Object.entries(units)) {
        if (timeString.includes(unit)) {
          const value = parseInt(timeString);
          return `${value}${unit.charAt(0)}`;
        }
      }
      return timeString;
    };

    return (
      <div className='rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        {/* Header */}
        <div className='border-b border-slate-200 p-6 dark:border-slate-700'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800'>
                  <i className='fas fa-bell text-blue-600 dark:text-blue-400'></i>
                  {unreadCount > 0 && (
                    <div className='absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white dark:bg-rose-600'>
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                  Notifications
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  {unreadCount} unread • {notifications.length} total
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className='rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                >
                  <i className='fas fa-check-double mr-1.5'></i>
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              >
                <i
                  className={`fas ${
                    isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'
                  } mr-1.5`}
                ></i>
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className='mt-4 flex gap-2'>
            {['all', 'unread', 'read'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === tab
                    ? 'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'border border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'unread' && unreadCount > 0 && (
                  <span className='ml-1.5 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white dark:bg-blue-600'>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className='max-h-[400px] overflow-y-auto'>
          {displayedNotifications.length > 0 ? (
            <div className='divide-y divide-slate-100 dark:divide-slate-700'>
              {displayedNotifications.map((notification) => {
                const config = getNotificationConfig(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`group cursor-pointer p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      !notification.read
                        ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
                        : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className='flex gap-3'>
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${config.color}`}
                      >
                        <i className={`fas ${config.icon}`}></i>
                      </div>

                      {/* Content */}
                      <div className='min-w-0 flex-1'>
                        <div className='mb-1 flex items-start justify-between'>
                          <div className='flex items-center gap-2'>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.color.replace(
                                'text-',
                                'bg-'
                              )} ${config.color.split(' ')[0]}`}
                            >
                              {config.label}
                            </span>
                            {!notification.read && (
                              <span className='h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400'></span>
                            )}
                          </div>
                          <span className='whitespace-nowrap text-xs text-slate-500 dark:text-slate-400'>
                            {formatRelativeTime(notification.time)}
                          </span>
                        </div>

                        <p
                          className={`text-sm ${
                            notification.read
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'font-medium text-slate-900 dark:text-white'
                          } mb-1`}
                        >
                          {notification.message}
                        </p>

                        {notification.details && (
                          <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
                            {notification.details}
                          </p>
                        )}

                        {/* Actions */}
                        <div className='mt-3 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100'>
                          {notification.type === 'assignment' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success('Opening assignment...');
                              }}
                              className='text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                            >
                              <i className='fas fa-external-link-alt mr-1'></i>
                              Open
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification.id);
                            }}
                            className='text-xs text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          >
                            Mark as read
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className='p-8 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700'>
                <i className='fas fa-bell-slash text-2xl text-slate-400 dark:text-slate-500'></i>
              </div>
              <h4 className='mb-2 text-lg font-medium text-slate-900 dark:text-white'>
                No notifications
              </h4>
              <p className='mb-4 text-slate-600 dark:text-slate-400'>
                {filter === 'unread'
                  ? "You're all caught up!"
                  : filter === 'read'
                    ? 'No read notifications'
                    : 'No notifications yet'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className='rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className='rounded-b-xl border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Showing {displayedNotifications.length} of{' '}
                {notifications.length} notifications
              </p>
              <div className='flex items-center gap-2'>
                {notifications.length > 3 && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className='text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                  >
                    <i className='fas fa-chevron-down mr-1'></i>
                    Show more
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className='text-sm font-medium text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400'
                >
                  <i className='fas fa-trash-alt mr-1'></i>
                  Clear all
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

NotificationCenter.displayName = 'NotificationCenter';

NotificationCenter.propTypes = {
  notifications: PropTypes.array,
  onNotificationClick: PropTypes.func,
  onMarkAllAsRead: PropTypes.func,
};

export default NotificationCenter;
