import { Link } from "react-router-dom";
import HeaderIcon from "./HeaderIcon";

/**
 * NotificationMenu Component
 * 
 * A sophisticated dropdown menu for displaying user-specific 
 * system alerts. Features read/unread state management, bulk 
 * dismissal actions, and direct links to the full notification center.
 */
const NotificationMenu = ({ notifications, unreadCount, onMarkAllAsRead, onClose }) => {
  return (
    <>
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <HeaderIcon name="bell" className="text-blue-500" size="text-sm" />
            Notifications
          </h3>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Mark all read
              </button>
            )}
            <Link
              to="/notifications"
              onClick={onClose}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 transition-colors cursor-pointer ${
                notification.read ? "border-transparent" : "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${notification.bgColor}`}>
                  <HeaderIcon name={notification.icon} className={notification.color} size="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <HeaderIcon name="bell-slash" className="text-gray-300 dark:text-gray-600 mb-2" size="text-3xl" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
        <Link
          to="/notifications"
          onClick={onClose}
          className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          View all notifications
          <HeaderIcon name="arrow-right" size="text-xs" />
        </Link>
      </div>
    </>
  );
};

export default NotificationMenu;
