import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Card = ({ children, className = '', onClick, hover = false, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${
        hover ? 'cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const PageCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const InfoCard = ({ title, children, icon: Icon, className = '', action }) => {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-3 ${className}`}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {Icon && <Icon size={18} className='text-indigo-600 dark:text-indigo-400' />}
          <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
            {title}
          </h3>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
};

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  textColor = 'text-indigo-600 dark:text-indigo-400',
  bgColor = 'bg-indigo-50 dark:bg-indigo-900/30',
  onClick,
  linkText = 'View Details',
}) => {
  return (
    <div
      onClick={onClick}
      className='group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800'
    >
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
            {title}
          </p>
          <p className='mt-2 text-3xl font-extrabold text-gray-900 dark:text-white'>
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgColor} ${textColor}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {onClick && (
        <div className='mt-4 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400'>
          <span>{linkText}</span>
          <ArrowRight size={14} className='transition-transform group-hover:translate-x-1' />
        </div>
      )}
    </div>
  );
};
