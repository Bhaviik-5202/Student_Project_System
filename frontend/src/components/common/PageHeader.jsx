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
  variant = 'default',
  small = false,
  className = '',
}) => {
  const isSmall = variant === 'small' || small;

  return (
    <div
      className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${
        isSmall ? 'px-4 py-3.5 sm:px-5 sm:py-3.5' : 'p-6'
      } ${className}`}
    >
      <div className='flex items-center gap-3'>
        {Icon && (
          <div
            className={`flex items-center justify-center ${
              isSmall ? 'h-9 w-9 rounded-xl' : 'h-12 w-12 rounded-2xl'
            } ${iconBg} shrink-0`}
          >
            {React.isValidElement(Icon) ? (
              Icon
            ) : (
              <Icon size={isSmall ? 20 : 26} className={iconColor} />
            )}
          </div>
        )}
        <div>
          {breadcrumbs && <div className='mb-1'>{breadcrumbs}</div>}
          <div className='flex items-center gap-2 flex-wrap'>
            <h1
              className={`${
                isSmall ? 'text-lg' : 'text-2xl'
              } font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2`}
            >
              {title}
            </h1>
            {badge && (
              typeof badge === 'string' ? (
                <span className='rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40'>
                  {badge}
                </span>
              ) : (
                badge
              )
            )}
          </div>
          {subtitle && (
            <p
              className={`mt-0.5 ${
                isSmall ? 'text-[11px]' : 'text-xs'
              } text-gray-500 dark:text-gray-400 font-medium`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className='flex flex-wrap items-center gap-2.5 shrink-0'>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
