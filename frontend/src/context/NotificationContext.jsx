import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export const NotificationContext = createContext();

// List of public and authentication route prefixes where notification toasts MUST NOT pop up
const PUBLIC_OR_AUTH_ROUTES = [
  '/',
  '/login',
  '/register',
  '/verify-otp',
  '/forgot-password',
  '/about',
  '/contact',
  '/help',
  '/faq',
  '/knowledge-base',
  '/user-guide',
  '/docs',
  '/status',
  '/privacy',
  '/terms',
  '/terms-and-conditions',
  '/feedback',
];

/**
 * Helper to determine whether the current route pathname is a public or auth page.
 * @param {string} pathname
 * @returns {boolean}
 */
const isPublicOrAuthPage = (pathname) => {
  if (!pathname) return true;
  const path = pathname.toLowerCase();
  if (path === '/' || path === '') return true;
  if (path.startsWith('/reset-password')) return true;
  return PUBLIC_OR_AUTH_ROUTES.some(
    (p) => p !== '/' && (path === p || path.startsWith(`${p}/`))
  );
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const isInitial = useRef(true);
  const currentUserId = useRef(null);

  /**
   * Clear all notification state and dismiss active notification toasts
   */
  const clearNotificationsState = useCallback(() => {
    setNotifications([]);
    isInitial.current = true;
    currentUserId.current = null;
    toast.dismiss();
  }, []);

  /**
   * Fetch notifications for the currently authenticated user
   */
  const fetchNotifications = useCallback(async () => {
    // Only proceed for authenticated users
    if (!isAuthenticated || !user) {
      setNotifications([]);
      isInitial.current = true;
      currentUserId.current = null;
      return;
    }

    const userId = (user._id || user.id)?.toString();
    if (currentUserId.current && currentUserId.current !== userId) {
      // Clear state when user account changes
      setNotifications([]);
      isInitial.current = true;
    }
    currentUserId.current = userId;

    try {
      setLoading(true);
      const res = await api.get('/notifications?limit=100');

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
        const isPublicPage = isPublicOrAuthPage(location.pathname);

        // Display toast popup ONLY if:
        // 1. User is authenticated
        // 2. Not the initial fetch for this session
        // 3. User is NOT on any public/auth page (Login, Signup, Forgot/Reset Password, Landing, Public pages)
        if (!isInitial.current && notifs.length > 0 && !isPublicPage) {
          const prevIds = new Set(prev.map((n) => (n._id || n.id)?.toString()));
          notifs.forEach((n) => {
            const notifId = (n._id || n.id)?.toString();
            if (!n.read && notifId && !prevIds.has(notifId)) {
              toast(
                (t) => (
                  <div className='flex items-start gap-2.5'>
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
  }, [user, isAuthenticated, location.pathname]);

  // Notification lifecycle: polling and cleanup
  useEffect(() => {
    // If not authenticated or no user, immediately stop polling, clear state and dismiss toasts
    if (!isAuthenticated || !user) {
      setNotifications([]);
      isInitial.current = true;
      currentUserId.current = null;
      toast.dismiss();
      return;
    }

    // Authenticated user: initial fetch
    fetchNotifications();

    // Polling interval ONLY runs when user is logged in
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated, user?._id || user?.id, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id || n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) =>
        prev.filter((n) => n._id !== id && n.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      await api.delete('/notifications/clear-all');
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        clearNotificationsState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationContext);
