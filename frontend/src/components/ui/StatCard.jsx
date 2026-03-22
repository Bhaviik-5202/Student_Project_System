import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const StatCard = memo(
  ({ title, value, icon, color = 'blue', change, trend = 'info' }) => {
    // Map color names to actual Tailwind classes
    const colorClasses = useMemo(
      () => ({
        blue: {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
        },
        green: {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
        },
        yellow: {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-600 dark:text-yellow-400',
          border: 'border-yellow-200 dark:border-yellow-800',
        },
        purple: {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800',
        },
        red: {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
        },
        indigo: {
          bg: 'bg-indigo-100 dark:bg-indigo-900/30',
          text: 'text-indigo-600 dark:text-indigo-400',
          border: 'border-indigo-200 dark:border-indigo-800',
        },
      }),
      []
    );

    const trendIcons = useMemo(
      () => ({
        up: {
          icon: 'fa-arrow-up',
          color: 'text-green-600 dark:text-green-400',
        },
        down: {
          icon: 'fa-arrow-down',
          color: 'text-red-600 dark:text-red-400',
        },
        attention: {
          icon: 'fa-exclamation-circle',
          color: 'text-yellow-600 dark:text-yellow-400',
        },
        info: {
          icon: 'fa-info-circle',
          color: 'text-blue-600 dark:text-blue-400',
        },
      }),
      []
    );

    const selectedColor = colorClasses[color] || colorClasses.blue;
    const selectedTrend = trendIcons[trend] || trendIcons.info;

    return (
      <div
        className={`rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-950 ${selectedColor.border} card-hover transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-900`}
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              {title}
            </p>
            <p className='mt-2 text-2xl font-bold text-gray-900 dark:text-white'>
              {value}
            </p>
          </div>
          <div
            className={`h-12 w-12 ${selectedColor.bg} flex items-center justify-center rounded-full`}
          >
            <i
              className={`fas ${icon} ${selectedColor.text} text-xl`}
              aria-hidden='true'
            ></i>
          </div>
        </div>
        <div className='mt-4'>
          <span className={`text-sm font-medium ${selectedTrend.color}`}>
            <i
              className={`fas ${selectedTrend.icon} mr-1`}
              aria-hidden='true'
            ></i>{' '}
            {change}
          </span>
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'blue',
    'green',
    'yellow',
    'purple',
    'red',
    'indigo',
  ]),
  change: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', 'attention', 'info']),
};

StatCard.defaultProps = {
  color: 'blue',
  trend: 'info',
};

export default StatCard;
