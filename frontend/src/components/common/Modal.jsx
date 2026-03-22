import { memo, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * Modal Component
 *
 * A reusable, accessible modal dialog box. Features backdrop-blur
 * overlays, outside-click termination, and theme-adaptive styling
 * for consistent user interaction.
 */
const Modal = memo(({ isOpen, onClose, title, children, className = "max-w-lg" }) => {
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full relative ${className} my-auto max-h-[95vh] flex flex-col overflow-hidden`}>
        <div className="sticky top-0 z-10 flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl shrink-0">

          <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 md:p-8 text-gray-900 dark:text-gray-100 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
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
  className: PropTypes.string,
};


export default Modal;
