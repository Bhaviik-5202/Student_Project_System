import React, { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../../hooks/useAuth";
import { timeAgo } from "../../../utils/helpers";

const ActivityItem = memo(({ activity, isLast }) => {
  const getIconClass = (iconName) => {
    const icons = {
      "fa-check-circle": "fa-check-circle",
      "check-circle": "fa-check-circle",
      "fa-comment": "fa-comment",
      "comment": "fa-comment",
      "message": "fa-comment",
      "fa-file-alt": "fa-file-alt",
      "file-text": "fa-file-alt",
      "fa-user-plus": "fa-user-plus",
      "user-plus": "fa-user-plus",
      "fa-exclamation-triangle": "fa-exclamation-triangle",
      "alert-circle": "fa-exclamation-circle",
      "fa-calendar": "fa-calendar-alt",
      "calendar": "fa-calendar-alt",
      "fa-bolt": "fa-bolt",
      "bolt": "fa-bolt",
      "zap": "fa-bolt",
    };
    
    return icons[iconName] || icons[activity.icon] || "fa-bolt";
  };

  const colorStyles = {
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    yellow: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  const colorClass = colorStyles[activity.color] || colorStyles.blue;
  const itemContent = (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative z-10">
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border border-transparent ${colorClass}`}>
        <i className={`fas ${getIconClass(activity.icon)} text-base`}></i>
      </div>
      
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex justify-between items-start mb-0.5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-4">
            {activity.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
            <i className="far fa-clock"></i>
            {activity.time || timeAgo(activity.updatedAt)}
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {activity.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-100 dark:bg-slate-700 -mb-4 z-0" />
      )}
      
      {activity.id ? (
        <Link to={`/projects/${activity.id}`} className="block">
          {itemContent}
        </Link>
      ) : (
        itemContent
      )}
    </div>
  );
});

ActivityItem.displayName = "ActivityItem";

const RecentActivity = memo(({ activities = [] }) => {
  const { user } = useAuth();
  const viewAllPath = user?.role === "admin" ? "/audit-log" : "/projects";

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Latest updates from your workspace
          </p>
        </div>
        <Link
          to={viewAllPath}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all 
          <i className="fas fa-chevron-right text-[10px]"></i>
        </Link>
      </div>

      <div className="space-y-2">
        {activities && activities.length > 0 ? (
          activities
            .filter((activity) => activity && activity.title)
            .map((activity, index) => (
              <ActivityItem 
                key={index} 
                activity={activity} 
                isLast={index === activities.length - 1} 
              />
            ))
        ) : (
          <div className="text-center py-10 opacity-60">
            <i className="fas fa-history text-3xl text-gray-300 dark:text-gray-600 mb-3"></i>
            <p className="text-sm text-gray-500 italic">
              No recent activity recorded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

RecentActivity.displayName = "RecentActivity";

RecentActivity.propTypes = {
  activities: PropTypes.array,
};

export default RecentActivity;
