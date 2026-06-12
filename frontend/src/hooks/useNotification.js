import { toast } from 'react-hot-toast';

/**
 * Notification hook backed by react-hot-toast for consistent UX app-wide.
 */
const useNotification = () => {
  return {
    showSuccess: (message) => toast.success(message),
    showError: (message) => toast.error(message),
    showWarning: (message) => toast(message, { icon: '⚠️' }),
    showInfo: (message) => toast(message),
    notifications: [],
    removeNotification: () => {},
  };
};

export default useNotification;
