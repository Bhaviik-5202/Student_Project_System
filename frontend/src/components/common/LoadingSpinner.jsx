// src/components/common/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ fullPage = false, size = "medium", message }) => {
  const sizeClasses = {
    small: "w-8 h-8 border-2",
    medium: "w-12 h-12 border-3",
    large: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-primary-600 rounded-full animate-spin`}
      ></div>
      {message && <p className="mt-4 text-gray-600 text-sm">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
