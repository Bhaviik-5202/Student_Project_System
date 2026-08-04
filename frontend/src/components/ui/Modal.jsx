import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal Dialog Component
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn'
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden transform transition-all duration-300 animate-scaleUp`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className='flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800'>
            <div>
              {title && (
                <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                  {subtitle}
                </p>
              )}
            </div>
            {showClose && (
              <button
                type='button'
                onClick={onClose}
                className='p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className='px-6 py-4'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
