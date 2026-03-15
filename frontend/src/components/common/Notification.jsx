import React, { memo, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * Notification Component
 * 
 * An inline alert component for system feedback. Supports 
 * multiple semantic types (success, error, warning, info) with 
 * theme-aware styling and optional manual dismissal.
 */
const Notification = memo(({ type = "info", message, onClose }) => {
  const bgColor = useMemo(
    () => ({
      success:
        "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-700 text-green-700 dark:text-green-400",
      error:
        "bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-700 text-red-700 dark:text-red-400",
      warning:
        "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400",
      info: "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-400",
    }),
    [],
  );

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <div
      className={`border rounded p-3 mb-2 ${bgColor[type]} transition-all duration-300`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={handleClose}
            className="ml-2 hover:opacity-70 transition-opacity"
            aria-label="Close notification"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
});

Notification.displayName = "Notification";

Notification.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

Notification.defaultProps = {
  type: "info",
  onClose: null,
};

export default Notification;
