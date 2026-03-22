import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Modal Component
 *
 * A reusable, accessible modal dialog box. Features backdrop-blur
 * overlays, outside-click termination, and theme-adaptive styling
 * for consistent user interaction.
 */
const Modal = memo(
  ({ isOpen, onClose, title, children, className = 'max-w-lg' }) => {
    const handleBackdropClick = useCallback(
      (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose]
    );

    if (!isOpen) return null;

    return (
      <div
        className='fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 p-4 backdrop-blur-md'
        onClick={handleBackdropClick}
        role='presentation'
      >
        <div
          className={`relative w-full rounded-2xl bg-white shadow-2xl dark:bg-slate-900 ${className} my-auto flex max-h-[95vh] flex-col overflow-hidden`}
        >
          <div className='sticky top-0 z-10 flex shrink-0 items-center justify-between rounded-t-2xl border-b border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='text-lg font-bold uppercase tracking-tight text-gray-900 dark:text-white'>
              {title}
            </h3>
            <button
              onClick={onClose}
              className='rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-gray-200'
              aria-label='Close modal'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='custom-scrollbar flex-1 overflow-y-auto p-4 text-gray-900 dark:text-gray-100 md:p-8'>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Modal;
