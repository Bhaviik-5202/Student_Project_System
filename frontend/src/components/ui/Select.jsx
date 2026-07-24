import React from 'react';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider'
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white shadow-xs transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
        {...props}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className='text-xs text-rose-500 mt-1'>{error}</p>}
    </div>
  );
};

export default Select;
