import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const StatsGrid = memo(({ stats = [] }) => {
  const renderedStats = useMemo(
    () =>
      stats.map((stat, index) => (
        <div
          key={index}
          className='rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-lg dark:bg-slate-800 dark:shadow-md dark:hover:shadow-lg'
        >
          <div className='flex items-center'>
            <div
              className={`rounded-full p-2 ${stat.bgColor || 'bg-blue-100 dark:bg-blue-900'}`}
            >
              {stat.icon}
            </div>
            <div className='ml-4'>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                {stat.label}
              </p>
              <p className='text-2xl font-bold text-slate-900 dark:text-white'>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      )),
    [stats]
  );

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {renderedStats}
    </div>
  );
});

StatsGrid.displayName = 'StatsGrid';

StatsGrid.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      icon: PropTypes.node,
      bgColor: PropTypes.string,
    })
  ),
};

StatsGrid.defaultProps = {
  stats: [],
};

export default StatsGrid;
