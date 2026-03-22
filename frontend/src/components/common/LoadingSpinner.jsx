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
  const sizeMap = {
    small: { dimensions: "w-8 h-8", stroke: 3, center: 12, radius: 9 },
    medium: { dimensions: "w-12 h-12", stroke: 4, center: 16, radius: 12 },
    large: { dimensions: "w-16 h-16", stroke: 4, center: 20, radius: 16 },
    lg: { dimensions: "w-16 h-16", stroke: 4, center: 20, radius: 16 },
  };

  const { dimensions, stroke, center, radius } = sizeMap[size] || sizeMap.medium;

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
    >
      <div className={`relative ${dimensions}`}>
        {/* Transparent background track */}
        <svg
          className="absolute inset-0 w-full h-full text-gray-200 dark:text-slate-800"
          viewBox={`0 0 ${center * 2} ${center * 2}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
          />
        </svg>

        {/* Animated spinner foreground */}
        <svg
          className="absolute inset-0 w-full h-full text-blue-600 dark:text-blue-400 animate-spin"
          viewBox={`0 0 ${center * 2} ${center * 2}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDuration: '0.8s' }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={radius * 2 * Math.PI}
            strokeDashoffset={radius * 2 * Math.PI * 0.7}
          />
        </svg>
      </div>

      {message && (
        <p
          className="mt-4 text-gray-600 dark:text-blue-400 text-sm font-medium animate-pulse text-center max-w-xs"
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
        className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-[9999]"
        role="dialog"
        aria-modal="true"
        aria-label="Loading"
      >
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
          {spinner}
        </div>
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
