/**
 * LoadingSpinner Component
 *
 * A configurable visual indicator for asynchronous operations.
 * Supports multiple sizes, optional status messages (aria-live),
 * and a full-page architectural overlay mode.
 */
import { memo } from "react";
import PropTypes from "prop-types";

const LoadingSpinner = ({
  fullPage = false,
  size = "medium",
  message,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-8 h-8 border-2",
    medium: "w-12 h-12 border-3",
    large: "w-16 h-16 border-4",
    lg: "w-16 h-16 border-4", // Alias for large
  };

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
    >
      <div
        className={`${sizeClasses[size] || sizeClasses.medium} border-gray-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin`}
        aria-label="Loading"
      />
      {message && (
        <p
          className="mt-4 text-gray-600 dark:text- text-sm animate-pulse"
          aria-live="polite"
        >
          {message}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900 bg-opacity-90 dark:bg-opacity-90 z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Loading"
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large", "lg"]),
  message: PropTypes.string,
  className: PropTypes.string,
};

LoadingSpinner.displayName = "LoadingSpinner";

export default memo(LoadingSpinner);
