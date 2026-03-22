import React, { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  UserPlus, 
  AlertCircle,
  Calendar,
  Zap,
  ChevronRight,
  MoreHorizontal,
  Clock
} from "lucide-react";

const ActivityItem = memo(({ activity, isLast }) => {
  const getIcon = (iconName) => {
    const icons = {
      "fa-check-circle": CheckCircle2,
      "check-circle": CheckCircle2,
      "fa-comment": MessageSquare,
      "comment": MessageSquare,
      "message": MessageSquare,
      "fa-file-alt": FileText,
      "file-text": FileText,
      "fa-user-plus": UserPlus,
      "user-plus": UserPlus,
      "fa-exclamation-triangle": AlertCircle,
      "alert-circle": AlertCircle,
      "fa-calendar": Calendar,
      "calendar": Calendar,
      "fa-bolt": Zap,
      "bolt": Zap,
      "zap": Zap,
    };
    
    // Default Lucide mapping for common FA names if they come as strings
    const Icon = icons[iconName] || icons[activity.icon] || Zap;
    return <Icon className="w-4 h-4" />;
  };

  const colorStyles = {
    green: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    yellow: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
    red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
  };

  const colorClass = colorStyles[activity.color] || colorStyles.blue;

  return (
    <div className="relative group">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-100 dark:bg-slate-700 -mb-4 z-0" />
      )}
      
      <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300 relative z-10">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-6 ${colorClass} shadow-sm shadow-inherit/20`}>
          {getIcon(activity.icon)}
        </div>
        
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate pr-4">
              {activity.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
              <Clock className="w-3 h-3" />
              {activity.time || "Recently"}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>
        
        <button className="flex-shrink-0 p-2 text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

ActivityItem.displayName = "ActivityItem";

const RecentActivity = memo(({ activities = [] }) => {
  return (
    <div className="animate-fade-in h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Latest updates from your workspace
          </p>
        </div>
        <Link
          to="/reports"
          className="group text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-md"
        >
          View all 
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="space-y-4">
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
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200 dark:border-slate-700">
              <Zap className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-400 dark:text-gray-500 font-medium italic">
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
