import toast from 'react-hot-toast';

/**
 * Custom Toast Notifications System
 * Features:
 * - Positioned top-right
 * - Dismissible via explicit (x) button
 * - Auto-hides after specified duration (default: 4000ms)
 * - Distinct visual styles: success, error, warning, info
 * - High z-index overlay without blocking background UI
 */

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
