import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  const showNotification = (type, message, duration = 5000) => {
    context.addNotification({
      type,
      message,
      duration,
    });
  };

  return {
    showSuccess: (message, duration) =>
      showNotification("success", message, duration),
    showError: (message, duration) =>
      showNotification("error", message, duration),
    showWarning: (message, duration) =>
      showNotification("warning", message, duration),
    showInfo: (message, duration) =>
      showNotification("info", message, duration),
    notifications: context.notifications,
    removeNotification: context.removeNotification,
  };
};

export default useNotification;
