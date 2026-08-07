import React from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  id = 'search-input',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400'>
        <Search className='h-4 w-4 shrink-0' />
      </div>
      <input
        id={id}
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-11 pr-11 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
      />
      {value && (
        <button
          type='button'
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200'
        >
          <X className='h-4 w-4' />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
