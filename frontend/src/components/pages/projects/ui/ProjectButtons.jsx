import React from 'react';

export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-5 py-3 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      <span>{children}</span>
    </button>
  );
};

export const SecondaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-5 py-3 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      <span>{children}</span>
    </button>
  );
};

export const DangerButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-5 py-3 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-bold text-white shadow-md shadow-red-500/20 transition-all hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      <span>{children}</span>
    </button>
  );
};

export const OutlineButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-5 py-3 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 font-bold text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-300 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      <span>{children}</span>
    </button>
  );
};

export const IconButton = ({
  icon: Icon,
  onClick,
  title,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400',
    indigo: 'text-gray-400 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400',
    purple: 'text-gray-400 dark:text-slate-400 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400',
    blue: 'text-gray-400 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400',
    emerald: 'text-gray-400 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400',
    amber: 'text-gray-400 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30 dark:hover:text-amber-400',
    danger: 'text-gray-400 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const paddingClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  return (
    <button
      type='button'
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`rounded-lg transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${paddingClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
};
