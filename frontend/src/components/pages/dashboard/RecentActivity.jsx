import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ActivityItem = memo(({ activity }) => {
  const colorStyles = {
    green: {
      bg: "bg-emerald-100 dark:bg-emerald-900",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-600 dark:text-blue-400",
    },
    yellow: {
      bg: "bg-amber-100 dark:bg-amber-900",
      text: "text-amber-600 dark:text-amber-400",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900",
      text: "text-purple-600 dark:text-purple-400",
    },
  };

  const colorClass = colorStyles[activity.color] || colorStyles.blue;

  return (
    <div className="flex items-start p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition duration-150 group">
      <div
        className={`flex-shrink-0 w-10 h-10 ${colorClass.bg} rounded-full flex items-center justify-center mr-4`}
      >
        <i className={`fas ${activity.icon} ${colorClass.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
          {activity.title}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {activity.description}
        </p>
      </div>
      <button className="ml-2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
        <i className="fas fa-ellipsis-h" />
      </button>
    </div>
  );
});

ActivityItem.displayName = "ActivityItem";

ActivityItem.propTypes = {
  activity: PropTypes.shape({
    type: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
};

const RecentActivity = memo(({ activities = [], userRole = "admin" }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-md border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Latest updates from your workspace
          </p>
        </div>
        <Link
          to="/reports"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
        >
          View all <i className="fas fa-chevron-right ml-1" />
        </Link>
      </div>
      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities
            .filter((activity) => activity && activity.title)
            .map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
});

RecentActivity.displayName = "RecentActivity";

RecentActivity.propTypes = {
  activities: PropTypes.array,
  userRole: PropTypes.oneOf(["admin", "faculty", "student"]),
};

export default RecentActivity;
