import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Empty State Placeholder Component
 */
const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl my-4 ${className}`}
    >
      <div className='p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-4'>
        <Icon className='w-8 h-8' />
      </div>
      <h3 className='text-base font-semibold text-slate-900 dark:text-slate-100'>
        {title}
      </h3>
      <p className='text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5'>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant='primary' size='sm' onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
