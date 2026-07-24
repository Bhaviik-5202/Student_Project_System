import { useState, useCallback } from 'react';
import HeaderIcon from './HeaderIcon';

/**
 * SearchBar Component
 *
 * A versatile search input providing system-wide lookup capabilities.
 * Features keyboard shortcut indicators (⌘K), responsive layout
 * adaptations, and real-time focus-state transitions.
 */
const SearchBar = ({ onSearch, isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        onSearch?.(searchQuery);
        setSearchQuery('');
      }
    },
    [searchQuery, onSearch]
  );

  return (
    <form onSubmit={handleSearch} className={isMobile ? 'w-full' : 'w-full'}>
      <div className='group relative'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
          <HeaderIcon
            name='magnifying-glass'
            className='text-gray-400 transition-colors group-focus-within:text-blue-500'
            size='text-sm'
          />
        </div>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isMobile
              ? 'Search everything...'
              : 'Search projects, students, meetings...'
          }
          className={`w-full rounded-xl border border-transparent bg-gray-100 dark:bg-gray-800 py-2.5 pl-11 pr-20 text-sm transition-all focus:border-blue-500 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20  dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-700 ${isMobile ? 'py-3.5 text-base' : ''}`}
          aria-label='Search'
          autoFocus={isMobile}
        />
        {!isMobile && (
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
            <kbd className='inline-flex items-center gap-1 rounded-md border border-gray-300 bg-gray-200 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 dark:border-gray-600  '>
              <span className='text-xs'>⌘</span>K
            </kbd>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
