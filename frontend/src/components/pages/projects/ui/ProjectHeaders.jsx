import React from 'react';
import PageHeader from '../../../common/PageHeader';

export { PageHeader };

export const SectionHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className='flex items-center gap-2.5'>
        {Icon && (
          <Icon size={18} className='text-indigo-600 dark:text-indigo-400' />
        )}
        <div>
          <h3 className='text-base font-bold text-gray-900 dark:text-white'>
            {title}
          </h3>
          {subtitle && (
            <p className='text-xs text-gray-500 dark:text-slate-400'>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
