// Simple in-memory notification system since the actual hook isn't available
const useNotification = () => {
  const showNotification = (type, message) => {
    // Create a simple alert for now
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white ${
      type === 'success'
        ? 'bg-green-500'
        : type === 'error'
          ? 'bg-red-500'
          : type === 'warning'
            ? 'bg-yellow-500 text-gray-800'
            : 'bg-blue-500'
    }`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  };

  return {
    showSuccess: (message) => showNotification('success', message),
    showError: (message) => showNotification('error', message),
    showWarning: (message) => showNotification('warning', message),
    showInfo: (message) => showNotification('info', message),
    notifications: [],
    removeNotification: () => {},
  };
};

export default useNotification;
