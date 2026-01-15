// src/components/pages/dashboard/NotificationCenter.jsx
import { useState, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";

// Constants for notification types
const NOTIFICATION_TYPES = {
  assignment: {
    icon: "fa-tasks",
    color: "text-yellow-600 bg-yellow-100 border-yellow-200",
    label: "Assignment",
  },
  grade: {
    icon: "fa-graduation-cap",
    color: "text-green-600 bg-green-100 border-green-200",
    label: "Grade",
  },
  announcement: {
    icon: "fa-bullhorn",
    color: "text-blue-600 bg-blue-100 border-blue-200",
    label: "Announcement",
  },
  meeting: {
    icon: "fa-calendar-alt",
    color: "text-purple-600 bg-purple-100 border-purple-200",
    label: "Meeting",
  },
  student: {
    icon: "fa-user-graduate",
    color: "text-indigo-600 bg-indigo-100 border-indigo-200",
    label: "Student",
  },
  approval: {
    icon: "fa-check-circle",
    color: "text-teal-600 bg-teal-100 border-teal-200",
    label: "Approval",
  },
  alert: {
    icon: "fa-exclamation-triangle",
    color: "text-red-600 bg-red-100 border-red-200",
    label: "Alert",
  },
  default: {
    icon: "fa-bell",
    color: "text-gray-600 bg-gray-100 border-gray-200",
    label: "Notification",
  },
};

const NotificationCenter = ({
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "unread", "read"

  // Memoized calculations
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
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
      toast.success("All notifications marked as read");
    }
  }, [onMarkAllAsRead]);

  const handleClearAll = useCallback(() => {
    toast((t) => (
      <div className="flex flex-col">
        <p className="font-medium">Clear all notifications?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.success("All notifications cleared");
            }}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear All
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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
      "h ago": 3600000,
      "m ago": 60000,
      "d ago": 86400000,
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-bell text-primary-600"></i>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              <p className="text-sm text-gray-600">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
              >
                <i className="fas fa-check-double mr-1.5"></i>
                Mark all read
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <i
                className={`fas ${
                  isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                } mr-1.5`}
              ></i>
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === tab
                  ? "bg-primary-100 text-primary-700 border border-primary-200"
                  : "text-gray-600 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto">
        {displayedNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {displayedNotifications.map((notification) => {
              const config = getNotificationConfig(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                    !notification.read ? "bg-blue-50 hover:bg-blue-100" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${config.color}`}
                    >
                      <i className={`fas ${config.icon}`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color.replace(
                              "text-",
                              "bg-"
                            )} ${config.color.split(" ")[0]}`}
                          >
                            {config.label}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatRelativeTime(notification.time)}
                        </span>
                      </div>

                      <p
                        className={`text-sm ${
                          notification.read
                            ? "text-gray-700"
                            : "text-gray-900 font-medium"
                        } mb-1`}
                      >
                        {notification.message}
                      </p>

                      {notification.details && (
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.details}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {notification.type === "assignment" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success("Opening assignment...");
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <i className="fas fa-external-link-alt mr-1"></i>
                            Open
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification.id);
                          }}
                          className="text-xs text-gray-600 hover:text-gray-700"
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
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bell-slash text-2xl text-gray-400"></i>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h4>
            <p className="text-gray-600 mb-4">
              {filter === "unread"
                ? "You're all caught up!"
                : filter === "read"
                ? "No read notifications"
                : "No notifications yet"}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {displayedNotifications.length} of {notifications.length}{" "}
              notifications
            </p>
            <div className="flex items-center gap-2">
              {notifications.length > 3 && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <i className="fas fa-chevron-down mr-1"></i>
                  Show more
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-600 hover:text-red-600 font-medium"
              >
                <i className="fas fa-trash-alt mr-1"></i>
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
