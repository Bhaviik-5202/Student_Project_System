import React, { memo, useMemo } from "react";
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

const RecentActivity = memo(({ userRole = "admin" }) => {
  const activities = useMemo(
    () => ({
    admin: [
      {
        type: "approved",
        icon: "fa-check-circle",
        title: 'Project "E-commerce Platform" approved',
        description: "By Dr. Smith • 2 hours ago",
        color: "green",
      },
      {
        type: "submission",
        icon: "fa-file-upload",
        title: "New project proposal submitted",
        description: "By John Doe • 4 hours ago",
        color: "blue",
      },
      {
        type: "meeting",
        icon: "fa-calendar-check",
        title: "Meeting scheduled for Group A",
        description: "By Prof. Johnson • 1 day ago",
        color: "yellow",
      },
      {
        type: "update",
        icon: "fa-sync-alt",
        title: "System update completed",
        description: "Version 2.1.0 deployed • 2 days ago",
        color: "purple",
      },
    ],
    faculty: [
      {
        type: "review",
        icon: "fa-clipboard-check",
        title: "Project review submitted",
        description: "For Group B • 1 hour ago",
        color: "green",
      },
      {
        type: "meeting",
        icon: "fa-video",
        title: "Meeting with Group C completed",
        description: "Yesterday • 3:00 PM",
        color: "blue",
      },
      {
        type: "submission",
        icon: "fa-upload",
        title: "New project proposal received",
        description: "From student • 1 day ago",
        color: "yellow",
      },
    ],
    student: [
      {
        type: "submission",
        icon: "fa-paper-plane",
        title: "Project proposal submitted",
        description: "Awaiting review • 1 day ago",
        color: "blue",
      },
      {
        type: "feedback",
        icon: "fa-comment-alt",
        title: "Feedback received on assignment",
        description: "From Dr. Johnson • 2 days ago",
        color: "green",
      },
      {
        type: "meeting",
        icon: "fa-calendar-plus",
        title: "Meeting scheduled",
        description: "Tomorrow at 2:00 PM • Room 302",
        color: "yellow",
      },
    ],
    }),
    []
  );

  const currentActivities = useMemo(
    () => activities[userRole] || activities.admin,
    [activities, userRole]
  );

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
        <a
          href="#"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
        >
          View all <i className="fas fa-chevron-right ml-1" />
        </a>
      </div>
      <div className="space-y-4">
        {currentActivities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
});

RecentActivity.displayName = "RecentActivity";

RecentActivity.propTypes = {
  userRole: PropTypes.oneOf(["admin", "faculty", "student"]),
};

export default RecentActivity;
