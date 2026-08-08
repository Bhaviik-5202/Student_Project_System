import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { History } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { timeAgo } from '../../../utils/helpers';

const ActivityItem = memo(({ activity, isLast }) => {
  const getIconClass = (iconName) => {
    const icons = {
      'fa-check-circle': 'fa-check-circle',
      'check-circle': 'fa-check-circle',
      'fa-comment': 'fa-comment',
      comment: 'fa-comment',
      message: 'fa-comment',
      'fa-file-alt': 'fa-file-alt',
      'file-text': 'fa-file-alt',
      'fa-user-plus': 'fa-user-plus',
      'user-plus': 'fa-user-plus',
      'fa-exclamation-triangle': 'fa-exclamation-triangle',
      'alert-circle': 'fa-exclamation-circle',
      'fa-calendar': 'fa-calendar-alt',
      calendar: 'fa-calendar-alt',
      'fa-bolt': 'fa-bolt',
      bolt: 'fa-bolt',
      zap: 'fa-bolt',
    };

    return icons[iconName] || icons[activity.icon] || 'fa-bolt';
  };

  const colorStyles = {
    green:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    yellow:
      'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    purple:
      'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  const colorClass = colorStyles[activity.color] || colorStyles.blue;
  const itemContent = (
    <div className='relative z-10 flex items-start gap-3.5 rounded-2xl p-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 bg-white/40 dark:bg-slate-900/40 border border-slate-100/80 dark:border-slate-800/50 shadow-xs'>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent sm:h-11 sm:w-11 ${colorClass}`}
      >
        <i className={`fas ${getIconClass(activity.icon)} text-sm sm:text-base`}></i>
      </div>

      <div className='min-w-0 flex-1 pt-0.5'>
        <div className='mb-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2'>
          <h4 className='truncate text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white leading-tight'>
            {activity.title}
          </h4>
          <div className='flex items-center gap-1.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold tracking-wide text-slate-500 dark:text-slate-400'>
            <i className='far fa-clock opacity-70'></i>
            {activity.time || timeAgo(activity.updatedAt)}
          </div>
        </div>
        <p className='line-clamp-2 text-[12px] font-medium leading-snug text-slate-600 dark:text-slate-400'>
          {activity.description}
        </p>
      </div>
    </div>
  );

  const getActivityPath = () => {
    if (activity.link) return activity.link;
    const type = (activity.type || activity.action || '').toLowerCase();
    const title = (activity.title || '').toLowerCase();

    // Route to specific project page when possible
    if (type === 'project' && (activity.id || activity._id)) {
      return `/projects/${activity.id || activity._id}`;
    }
    if (type.includes('meeting') || title.includes('meeting'))
      return '/meetings';
    if (
      type.includes('resource') ||
      title.includes('resource') ||
      title.includes('document')
    )
      return '/resources';
    if (type.includes('student') || title.includes('student'))
      return '/students';
    if (
      type.includes('staff') ||
      title.includes('faculty') ||
      title.includes('guide')
    )
      return '/staff';
    // Generic project fallback with ID if available
    if (activity.id || activity._id)
      return `/projects/${activity.id || activity._id}`;
    return '/projects';
  };

  return (
    <div className='relative'>
      {/* Timeline connector - positioned exactly at the center of the 40px icon (padding 14px + 20px) = 34px -> left-[34px] */}
      {!isLast && (
        <div className='absolute bottom-0 left-[34px] top-12 z-0 -mb-4 w-0.5 bg-slate-200 dark:bg-slate-700/60' />
      )}

      <Link to={getActivityPath()} className='block'>
        {itemContent}
      </Link>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

const RecentActivity = memo(({ activities = [] }) => {
  const { user } = useAuth();
  const viewAllPath = user?.role === 'admin' ? '/audit-log' : '/projects';

  return (
    <div className='h-full p-4 sm:p-5'>
      <div className='mb-5 flex items-center justify-between'>
        <div>
          <h3 className='text-[15px] sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Recent Activity
          </h3>
          <p className='text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5'>
            Latest updates from your workspace
          </p>
        </div>
      </div>

      <div className='space-y-2'>
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
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-700'>
            <History className='mb-3 text-slate-300 dark:text-slate-600' size={36} />
            <p className='text-sm font-semibold text-slate-600 dark:text-slate-300'>
              No recent activities available.
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4'>
              Your workspace history will appear here.
            </p>
            <Link
              to={viewAllPath}
              className='rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
            >
              View History
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

RecentActivity.displayName = 'RecentActivity';

RecentActivity.propTypes = {
  activities: PropTypes.array,
};

export default RecentActivity;
