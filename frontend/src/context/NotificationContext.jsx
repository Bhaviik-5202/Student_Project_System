import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from "react";

const NotificationContext = createContext(null);

// Notification types
const NOTIFICATION_TYPES = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
});

// Default auto-dismiss duration (in milliseconds)
const DEFAULT_DURATION = 5000;
const MAX_NOTIFICATIONS = 5;

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export { NOTIFICATION_TYPES };
export default NotificationContext;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef(new Map());

  // Add notification with proper state update
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random(); // More unique ID
    const duration = notification.duration ?? DEFAULT_DURATION;
    const type = notification.type || NOTIFICATION_TYPES.INFO;

    const newNotification = {
      id,
      type,
      message: notification.message || "Notification",
      title: notification.title,
      duration,
      timestamp: new Date().toISOString(),
    };

    setNotifications((prevNotifications) => {
      // Limit max notifications
      const updated = [...prevNotifications, newNotification];
      return updated.slice(-MAX_NOTIFICATIONS);
    });

    // Auto remove after duration (only if duration > 0)
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, duration);

      timeoutRefs.current.set(id, timeoutId);
    }

    return id;
  }, []);

  // Remove notification by id
  const removeNotification = useCallback((id) => {
    // Clear timeout if exists
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current.clear();

    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
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

  const error = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message,
        duration: options.duration ?? 7000, // Errors stay longer
        ...options,
      });
    },
    [addNotification]
  );

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

  // Memoize context value
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
