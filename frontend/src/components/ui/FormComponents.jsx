import React from 'react';

export const FormGroup = ({ children, className = '' }) => {
  return <div className={`space-y-1.5 ${className}`}>{children}</div>;
};

export const Label = ({ children, required = false, className = '', ...props }) => {
  return (
    <label
      className={`block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export const FormError = ({ children, className = '' }) => {
  if (!children) return null;
  return (
    <p className={`text-xs font-medium text-red-600 dark:text-red-400 mt-1 ${className}`}>
      {children}
    </p>
  );
};

export const HelperText = ({ children, className = '' }) => {
  if (!children) return null;
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${className}`}>
      {children}
    </p>
  );
};
