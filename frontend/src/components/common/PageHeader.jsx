import React from 'react';
import { FolderKanban } from 'lucide-react';

export const PageHeader = ({
  title,
  subtitle,
  icon: Icon = FolderKanban,
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  iconBg = 'bg-indigo-50 dark:bg-indigo-900/30',
  badge,
  breadcrumbs,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      <div className='flex items-center gap-3.5'>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} shrink-0`}>
            {React.isValidElement(Icon) ? (
              Icon
            ) : (
              <Icon size={26} className={iconColor} />
            )}
          </div>
        )}
        <div>
          {breadcrumbs && <div className='mb-1.5'>{breadcrumbs}</div>}
          <div className='flex items-center gap-2.5 flex-wrap'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2'>
              {title}
            </h1>
            {badge && (
              typeof badge === 'string' ? (
                <span className='rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40'>
                  {badge}
                </span>
              ) : (
                badge
              )
            )}
          </div>
          {subtitle && (
            <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400 font-medium'>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className='flex flex-wrap items-center gap-3 shrink-0'>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
