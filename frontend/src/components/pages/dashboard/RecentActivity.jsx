import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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
    <div className='relative z-10 flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-slate-700'>
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-transparent ${colorClass}`}
      >
        <i className={`fas ${getIconClass(activity.icon)} text-base`}></i>
      </div>

      <div className='min-w-0 flex-1 pt-1'>
        <div className='mb-0.5 flex items-start justify-between'>
          <h4 className='truncate pr-4 text-sm font-semibold text-gray-900 dark:text-white'>
            {activity.title}
          </h4>
          <div className='flex items-center gap-1.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 dark:text-gray-400'>
            <i className='far fa-clock'></i>
            {activity.time || timeAgo(activity.updatedAt)}
          </div>
        </div>
        <p className='line-clamp-2 text-sm text-gray-500 dark:text-gray-400'>
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
      {/* Timeline connector */}
      {!isLast && (
        <div className='absolute bottom-0 left-6 top-10 z-0 -mb-4 w-0.5 bg-gray-100 dark:bg-slate-700' />
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
    <div className='h-full'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
            Recent Activity
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
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
          <div className='py-10 text-center opacity-60'>
            <i className='fas fa-history mb-3 text-3xl text-gray-300 dark:text-gray-600 dark:text-gray-300'></i>
            <p className='text-sm italic text-gray-500 dark:text-gray-400'>
              No recent activity recorded.
            </p>
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
