import { useState, useCallback } from "react";
import HeaderIcon from "./HeaderIcon";

/**
 * SearchBar Component
 * 
 * A versatile search input providing system-wide lookup capabilities. 
 * Features keyboard shortcut indicators (⌘K), responsive layout 
 * adaptations, and real-time focus-state transitions.
 */
const SearchBar = ({ onSearch, isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        onSearch?.(searchQuery);
        setSearchQuery("");
      }
    },
    [searchQuery, onSearch],
  );

  return (
    <form onSubmit={handleSearch} className={isMobile ? "w-full" : "w-full"}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <HeaderIcon
            name="magnifying-glass"
            className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
            size="text-sm"
          />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isMobile ? "Search everything..." : "Search projects, students, meetings..."}
          className={`w-full pl-11 pr-20 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-700 text-sm dark:text-white dark:placeholder-gray-400 transition-all ${isMobile ? "py-3.5 text-base" : ""}`}
          aria-label="Search"
          autoFocus={isMobile}
        />
        {!isMobile && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md border border-gray-300 dark:border-gray-600">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
