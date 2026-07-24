import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Error State Alert Component
 */
const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load content. Please try again later.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
    >
      <div className='flex items-start space-x-3'>
        <AlertCircle className='w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5' />
        <div>
          <h4 className='text-sm font-semibold text-red-900 dark:text-red-200'>
            {title}
          </h4>
          <p className='text-xs text-red-700 dark:text-red-300 mt-0.5'>
            {message}
          </p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant='danger'
          size='sm'
          onClick={onRetry}
          icon={RefreshCw}
          className='shrink-0'
        >
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
