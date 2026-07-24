import toast from 'react-hot-toast';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Custom Toast Notifications System
 * Features:
 * - Positioned top-right
 * - Dismissible via explicit (x) button
 * - Auto-hides after specified duration (default: 4000ms)
 * - Distinct visual styles: success, error, warning, info
 * - High z-index overlay without blocking background UI
 */

const renderToast = (t, type, message, icon) => {
  const styles = {
    success: 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-xl shadow-emerald-950/20 dark:bg-slate-900/95 dark:border-emerald-500/40',
    error: 'bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-xl shadow-rose-950/20 dark:bg-slate-900/95 dark:border-rose-500/40',
    warning: 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-xl shadow-amber-950/20 dark:bg-slate-900/95 dark:border-amber-500/40',
    info: 'bg-slate-900/95 border-blue-500/40 text-slate-100 shadow-xl shadow-blue-950/20 dark:bg-slate-900/95 dark:border-blue-500/40',
  };

  const iconColors = {
    success: 'text-emerald-400',
    error: 'text-rose-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
  };

  return (
    <div
      className={`${
        t.visible ? 'animate-enter opacity-100 scale-100' : 'animate-leave opacity-0 scale-95'
      } flex max-w-md w-full items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-200 pointer-events-auto ${
        styles[type] || styles.info
      }`}
    >
      <div className={`mt-0.5 shrink-0 ${iconColors[type] || iconColors.info}`}>
        {icon}
      </div>
      <div className='flex-1 text-sm font-medium leading-5 text-slate-100'>
        {message}
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className='shrink-0 rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white dark:bg-slate-900/10 transition-colors focus:outline-none'
        aria-label='Close notification'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );
};

export const notify = {
  success: (msg, duration = 2500) =>
    toast.success(msg, {
      duration,
      position: 'top-right',
    }),

  error: (msg, duration = 2500) =>
    toast.error(msg, {
      duration,
      position: 'top-right',
    }),

  warning: (msg, duration = 2500) =>
    toast(msg, {
      duration,
      position: 'top-right',
      icon: '⚠️',
    }),

  info: (msg, duration = 2500) =>
    toast(msg, {
      duration,
      position: 'top-right',
    }),

  dismiss: (id) => toast.dismiss(id),
};

export default notify;
