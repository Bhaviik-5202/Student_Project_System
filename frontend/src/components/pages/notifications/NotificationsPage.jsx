import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  CheckCheck,
  RefreshCw,
  Filter,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import { useNotificationsContext } from '../../../context/NotificationContext';
import { timeAgo } from '../../../utils/helpers';
import { toast } from 'react-hot-toast';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationsContext();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  // Mark all as read when opening full notification page
  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  }, []);

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'read') return item.read;
    return true;
  });

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      await clearAll();
      toast.success('All notifications cleared');
    }
  };

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Notification Center'
        subtitle='Stay updated with real-time system alerts, project updates, and meeting invites'
        icon={Bell}
        badge={`${unreadCount} Unread`}
        actions={
          <div className='flex gap-2'>
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className='flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all dark:border-slate-700'
            >
              <CheckCheck size={14} className='text-blue-500' />
              Mark All Read
            </button>
            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className='flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-all dark:border-slate-700'
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        }
      />

      <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-6'>
        {/* Filter Controls */}
        <div className='flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-4'>
          <div className='flex items-center gap-2'>
            <Filter size={16} className='text-gray-400' />
            <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>
              Filter:
            </span>
            {['all', 'unread', 'read'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition-all ${
                  filter === mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={fetchNotifications}
            className='flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline'
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Notifications List */}
        <div className='space-y-3'>
          {filteredNotifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <div className='mb-3 rounded-full bg-gray-100 p-4 dark:bg-slate-800'>
                <Bell size={28} className='text-gray-400 dark:text-gray-500' />
              </div>
              <h4 className='text-base font-bold text-gray-800 dark:text-gray-200'>
                No Notifications Found
              </h4>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                {filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : 'You have no notifications in your inbox.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const id = notif._id || notif.id;
              return (
                <div
                  key={id}
                  onClick={() => !notif.read && markAsRead(id)}
                  className={`group flex items-start justify-between rounded-xl border p-4 transition-all duration-200 ${
                    notif.read
                      ? 'border-gray-100 bg-white dark:border-slate-700/60 dark:bg-slate-800/60'
                      : 'border-blue-200 bg-gradient-to-r from-blue-50/70 to-blue-100/30 dark:border-blue-800/60 dark:from-blue-900/20 dark:to-slate-800'
                  }`}
                >
                  <div className='flex items-start gap-3.5 flex-1 min-w-0 pr-4'>
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                        notif.type === 'error'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : notif.type === 'success'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : notif.type === 'warning'
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      <Bell size={18} />
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-wrap items-center gap-2 mb-1'>
                        <span className='rounded bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300'>
                          {notif.type || 'System'}
                        </span>
                        <span className='text-[11px] text-gray-400 dark:text-gray-500'>
                          {timeAgo(notif.createdAt || notif.time)}
                        </span>
                        {!notif.read && (
                          <span className='h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 inline-block' />
                        )}
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${
                          notif.read
                            ? 'text-gray-700 dark:text-gray-300 font-normal'
                            : 'text-gray-900 dark:text-white font-semibold'
                        }`}
                      >
                        {notif.message || notif.title}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-1 shrink-0'>
                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(id);
                        }}
                        className='rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400 transition-colors'
                        title='Mark as read'
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(id);
                      }}
                      className='rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors'
                      title='Delete notification'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
