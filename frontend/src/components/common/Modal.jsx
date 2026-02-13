import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";

const Modal = memo(({ isOpen, onClose, title, children }) => {
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-gray-950 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
            title="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4 text-gray-900 dark:text-gray-100">{children}</div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
