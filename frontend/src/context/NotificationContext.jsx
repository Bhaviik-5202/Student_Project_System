import { createContext, useState, useCallback, useRef, useMemo } from 'react';

/**
 * Context for managing global application notifications (toasts)
 */
const NotificationContext = createContext(null);

import { NOTIFICATION_TYPES } from './notificationUtils';

const DEFAULT_DURATION = 5000;
const MAX_NOTIFICATIONS = 5;

export default NotificationContext;

/**
 * Provider component for notification management
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef(new Map());

  /**
   * Internal method to queue a new notification
   * @param {Object} notification - Notification properties
   * @returns {number} The unique ID of the notification
   */
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const duration = notification.duration ?? DEFAULT_DURATION;
    const type = notification.type || NOTIFICATION_TYPES.INFO;

    const newNotification = {
      id,
      type,
      message: notification.message || 'Notification',
      title: notification.title,
      duration,
      timestamp: new Date().toISOString(),
    };

    setNotifications((prevNotifications) => {
      const updated = [...prevNotifications, newNotification];
      return updated.slice(-MAX_NOTIFICATIONS);
    });

    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, duration);

      timeoutRefs.current.set(id, timeoutId);
    }

    return id;
  }, []);

  /**
   * Remove a notification from the active list
   * @param {number} id - Notification ID
   */
  const removeNotification = useCallback((id) => {
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  /**
   * Clear all active and pending notifications
   */
  const clearAllNotifications = useCallback(() => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current.clear();
    setNotifications([]);
  }, []);

  /**
   * Trigger a success notification
   */
  const success = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  /**
   * Trigger an error notification with longer default duration
   */
  const error = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message,
        duration: options.duration ?? 7000,
        ...options,
      });
    },
    [addNotification]
  );

  /**
   * Trigger a warning notification
   */
  const warning = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: NOTIFICATION_TYPES.WARNING,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  /**
   * Trigger an information notification
   */
  const info = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: NOTIFICATION_TYPES.INFO,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
      success,
      error,
      warning,
      info,
      NOTIFICATION_TYPES,
    }),
    [
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
      success,
      error,
      warning,
      info,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
