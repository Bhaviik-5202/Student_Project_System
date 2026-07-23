import React from 'react';
import { Search } from 'lucide-react';

export const Label = ({ children, required = false, className = '' }) => {
  return (
    <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${className}`}>
      {children} {required && <span className='text-red-500'>*</span>}
    </label>
  );
};

export const FormGroup = ({ label, required, children, error, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error && <p className='text-[11px] font-medium text-red-500 mt-1'>{error}</p>}
    </div>
  );
};

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 ${className}`}
      {...props}
    />
  );
};

export const Select = ({ children, className = '', ...props }) => {
  return (
    <select
      className={`w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export const TextArea = ({ className = '', rows = 3, ...props }) => {
  return (
    <textarea
      rows={rows}
      className={`w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 ${className}`}
      {...props}
    />
  );
};

export const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400'
        {...props}
      />
    </div>
  );
};
