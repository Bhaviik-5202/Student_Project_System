import React from 'react';
import { useToaster, toast } from 'react-hot-toast';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from 'lucide-react';

/**
 * ToastItem Component
 * Single notification toast card with Close button, custom icons, and theme integration.
 */
const ToastItem = ({ t, handlers }) => {
  const { startPause, endPause } = handlers || {};

  const getTypeConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500/40 dark:border-emerald-500/40',
          iconBg:
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
          icon: <CheckCircle2 className='h-5 w-5' />,
        };
      case 'error':
        return {
          border: 'border-rose-500/40 dark:border-rose-500/40',
          iconBg:
            'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
          icon: <AlertCircle className='h-5 w-5' />,
        };
      case 'warning':
        return {
          border: 'border-amber-500/40 dark:border-amber-500/40',
          iconBg:
            'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
          icon: <AlertTriangle className='h-5 w-5' />,
        };
      case 'loading':
        return {
          border: 'border-indigo-500/40 dark:border-indigo-500/40',
          iconBg:
            'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
          icon: <Loader2 className='h-5 w-5 animate-spin' />,
        };
      default:
        return {
          border: 'border-blue-500/40 dark:border-blue-500/40',
          iconBg:
            'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
          icon: <Info className='h-5 w-5' />,
        };
    }
  };

  const config = getTypeConfig(t.type);

  // Render message content dynamically
  const renderMessage = () => {
    if (typeof t.message === 'function') {
      return t.message(t);
    }
    return t.message;
  };

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      className={`
        pointer-events-auto relative flex w-full max-w-sm items-start gap-3 rounded-2xl border p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 ease-out
        bg-white/95 text-slate-900 shadow-slate-900/10
        dark:bg-slate-900/95 dark:text-slate-100 dark:shadow-black/40
        ${config.border}
        ${t.visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-6 opacity-0 scale-95'}
      `}
      role='alert'
    >
      {/* Type Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
      >
        {t.icon || config.icon}
      </div>

      {/* Message Text */}
      <div className='min-w-0 flex-1 pt-1 pr-6'>
        <p className='text-md font-semibold leading-relaxed text-slate-800 dark:text-slate-200 break-words'>
          {renderMessage()}
        </p>
      </div>

      {/* Top-Right Close (X) Button */}
      <button
        type='button'
        onClick={() => toast.dismiss(t.id)}
        className='absolute top-3 right-3 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none'
        aria-label='Close notification'
        title='Close notification'
      >
        <X className='h-3.5 w-3.5' />
      </button>
    </div>
  );
};

/**
 * CustomToaster Component
 * Global toast notification container with auto-dismiss duration (2.5s), hover pause, and custom animations.
 */
export const CustomToaster = () => {
  const { toasts, handlers } = useToaster({
    duration: 2500, // Auto hide after 2.5 seconds
  });

  return (
    <div
      aria-live='polite'
      className='fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0 sm:top-6 sm:right-6'
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} handlers={handlers} />
      ))}
    </div>
  );
};

export default CustomToaster;
