import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
// import { BellIcon } from '@heroicons/react/24/outline';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const isInitial = useRef(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      isInitial.current = true;
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/notifications');

      let notifs = [];
      if (Array.isArray(res)) {
        notifs = res;
      } else if (Array.isArray(res?.data)) {
        notifs = res.data;
      } else if (Array.isArray(res?.data?.notifications)) {
        notifs = res.data.notifications;
      } else if (Array.isArray(res?.notifications)) {
        notifs = res.notifications;
      }

      setNotifications((prev) => {
        if (!isInitial.current && notifs.length > 0) {
          const prevIds = new Set(prev.map((n) => (n._id || n.id)?.toString()));
          notifs.forEach((n) => {
            const notifId = (n._id || n.id)?.toString();
            if (!n.read && notifId && !prevIds.has(notifId)) {
              toast(
                (t) => (
                  <div className='flex items-start gap-2.5'>
                    {/* <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" /> */}
                    <div className='flex-1 text-xs font-semibold text-slate-800 dark:text-white'>
                      {n.message}
                    </div>
                  </div>
                ),
                {
                  duration: 4000,
                  position: 'top-right',
                }
              );
            }
          });
        }
        isInitial.current = false;
        return notifs;
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh every 10 seconds for real-time alerts
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id || n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id && n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      const allNotifs = [...notifications];
      for (const notif of allNotifs) {
        await api.delete(`/notifications/${notif._id || notif.id}`);
      }
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationContext);
