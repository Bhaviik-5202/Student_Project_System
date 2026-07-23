import React from 'react';

export const Badge = ({ children, variant = 'indigo', className = '' }) => {
  const variantStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/40',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-100 dark:border-blue-800/40',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-100 dark:border-amber-800/40',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-purple-100 dark:border-purple-800/40',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-100 dark:border-red-800/40',
    gray: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 border-gray-200 dark:border-slate-600',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
        variantStyles[variant] || variantStyles.indigo
      } ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const s = (status || '').toLowerCase().replace(' ', '_');

  const getStatusConfig = (st) => {
    switch (st) {
      case 'completed':
      case 'approved':
      case 'active':
        return { label: st.replace('_', ' '), variant: 'emerald' };
      case 'in_progress':
      case 'assigned':
      case 'planning':
        return { label: st.replace('_', ' '), variant: 'blue' };
      case 'under_review':
      case 'pending':
        return { label: st.replace('_', ' '), variant: 'amber' };
      case 'rejected':
      case 'inactive':
        return { label: st.replace('_', ' '), variant: 'red' };
      default:
        return { label: (st || 'assigned').replace('_', ' '), variant: 'gray' };
    }
  };

  const config = getStatusConfig(s);

  return (
    <Badge variant={config.variant} className={`rounded-full px-2.5 ${className}`}>
      {config.label}
    </Badge>
  );
};
