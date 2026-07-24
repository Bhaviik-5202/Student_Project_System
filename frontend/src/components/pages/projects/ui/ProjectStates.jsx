import React from 'react';
import { FolderKanban, AlertTriangle, Loader2 } from 'lucide-react';
import { PrimaryButton } from './ProjectButtons';

export const LoadingState = ({ message = 'Loading project data...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <Loader2 size={36} className='animate-spin text-indigo-600 dark:text-indigo-400 mb-3' />
      <p className='text-xs font-semibold text-gray-500 dark:text-slate-400 animate-pulse'>
        {message}
      </p>
    </div>
  );
};

export const EmptyState = ({
  title = 'No Projects Found',
  description = 'No project records match the current criteria.',
  icon: Icon = FolderKanban,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-14 px-6 text-center dark:border-slate-700 dark:bg-slate-800/40 ${className}`}>
      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-4'>
        <Icon size={28} />
      </div>
      <h3 className='text-base font-bold text-gray-900 dark:text-white'>
        {title}
      </h3>
      <p className='mt-1 mx-auto max-w-sm text-xs text-gray-500 dark:text-slate-400 leading-relaxed'>
        {description}
      </p>
      {actionText && onAction && (
        <div className='mt-5 flex justify-center'>
          <PrimaryButton onClick={onAction} size='sm'>
            {actionText}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading project data.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`rounded-2xl border border-red-200 bg-red-50/50 py-12 px-6 text-center dark:border-red-900/40 dark:bg-red-900/10 ${className}`}>
      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 mb-3'>
        <AlertTriangle size={24} />
      </div>
      <h3 className='text-sm font-bold text-red-900 dark:text-red-200'>
        {title}
      </h3>
      <p className='mt-1 text-xs text-red-700 dark:text-red-300 max-w-md mx-auto'>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className='mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 transition-colors'
        >
          Try Again
        </button>
      )}
    </div>
  );
};
