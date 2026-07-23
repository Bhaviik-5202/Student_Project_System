import React from 'react';
import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton, DangerButton } from './ProjectButtons';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconColor = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  children,
  maxWidth = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in'>
      <div className={`w-full ${maxWidth} overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800 border border-gray-100 dark:border-slate-700`}>
        {/* Modal Header */}
        <div className='flex items-center justify-between border-b border-gray-100 p-6 dark:border-slate-700'>
          <div className='flex items-center gap-3'>
            {Icon && (
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColor}`}>
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && (
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            type='button'
            className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-gray-200'
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth='max-w-md'>
      <div className='p-6 space-y-6'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>{message}</p>
        <div className='flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-slate-700'>
          <SecondaryButton onClick={onClose} disabled={loading}>
            {cancelText}
          </SecondaryButton>
          {isDanger ? (
            <DangerButton onClick={onConfirm} disabled={loading}>
              {loading ? 'Processing...' : confirmText}
            </DangerButton>
          ) : (
            <PrimaryButton onClick={onConfirm} disabled={loading}>
              {loading ? 'Processing...' : confirmText}
            </PrimaryButton>
          )}
        </div>
      </div>
    </Modal>
  );
};
