import React, { useState } from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';

/**
 * Reusable Input Component
 * Supports types: text, email, password, number, textarea, select, search, checkbox, radio
 */
export const Input = ({
  label,
  error,
  helperText,
  type = 'text',
  icon: Icon = null,
  className = '',
  containerClassName = '',
  options = [], // for select dropdown
  rows = 4, // for textarea
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputBaseStyles =
    'w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 rounded-lg text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800';

  const borderColor = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-slate-300 dark:border-slate-700';

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5'>
          {label}
          {props.required && <span className='text-red-500 ml-0.5'>*</span>}
        </label>
      )}

      <div className='relative rounded-lg shadow-sm'>
        {Icon && type !== 'search' && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400'>
            <Icon className='w-4 h-4' />
          </div>
        )}

        {type === 'search' && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400'>
            <Search className='w-4 h-4' />
          </div>
        )}

        {type === 'textarea' ? (
          <textarea
            rows={rows}
            className={`${inputBaseStyles} ${borderColor} ${className}`}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            className={`${inputBaseStyles} ${borderColor} ${Icon ? 'pl-9' : ''} ${className}`}
            {...props}
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            className={`${inputBaseStyles} ${borderColor} ${
              Icon || type === 'search' ? 'pl-9' : ''
            } ${isPassword ? 'pr-10' : ''} ${className}`}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200'
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p className='mt-1 text-xs text-red-600 dark:text-red-400 font-medium'>
          {error}
        </p>
      ) : helperText ? (
        <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
