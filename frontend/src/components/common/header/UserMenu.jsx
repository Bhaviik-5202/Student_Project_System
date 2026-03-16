import { Link } from "react-router-dom";
import HeaderIcon from "./HeaderIcon";

/**
 * UserMenu Component
 *
 * An advanced user identity and navigation hub. Displays profile
 * metadata, provides quick links to personal settings and admin panels,
 * and handles secure session termination.
 */
const UserMenu = ({ user, initials, onLogout, onClose }) => {
  return (
    <div className="py-2">
      {/* User Info Header */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-bold text-xl">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-900 dark:text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "user@example.com"}
            </p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg capitalize">
              <HeaderIcon name="shield-halved" size="text-[10px]" />
              {user?.role || "user"}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="py-2">
        {[
          { icon: "gauge-high", label: "Dashboard", path: "/dashboard" },
          { icon: "user", label: "My Profile", path: "/profile" },
          { icon: "gear", label: "Settings", path: "/settings" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <HeaderIcon
                name={item.icon}
                className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                size="text-sm"
              />
            </div>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        {user?.role === "admin" && (
          <Link
            to="/admin-dashboard"
            onClick={onClose}
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 group transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <HeaderIcon
                name="shield-halved"
                className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                size="text-sm"
              />
            </div>
            <span className="font-medium">Admin Panel</span>
          </Link>
        )}

        <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-4"></div>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center mr-3 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
            <HeaderIcon
              name="right-from-bracket"
              className="text-red-500"
              size="text-sm"
            />
          </div>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
