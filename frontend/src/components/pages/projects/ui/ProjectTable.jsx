import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Table = ({ children, className = '' }) => {
  return (
    <div
      className={`table-responsive overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      <table className='w-full text-left text-xs min-w-[600px]'>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children, className = '' }) => {
  return (
    <thead
      className={`border-b border-gray-100 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 ${className}`}
    >
      {children}
    </thead>
  );
};

export const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '', align = 'left' }) => {
  const alignClass =
    align === 'right'
      ? 'text-right'
      : align === 'center'
        ? 'text-center'
        : 'text-left';
  return (
    <th className={`p-2.5 sm:p-4 font-bold ${alignClass} ${className}`}>{children}</th>
  );
};

export const TableBody = ({ children, className = '' }) => {
  return (
    <tbody
      className={`divide-y divide-gray-100 dark:divide-slate-700 ${className}`}
    >
      {children}
    </tbody>
  );
};

export const TableCell = ({ children, className = '', align = 'left' }) => {
  const alignClass =
    align === 'right'
      ? 'text-right'
      : align === 'center'
        ? 'text-center'
        : 'text-left';
  return <td className={`p-2.5 sm:p-4 ${alignClass} ${className}`}>{children}</td>;
};

export const Pagination = ({
  page = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200 pt-4 dark:border-slate-700 ${className}`}
    >
      <p className='text-xs font-semibold text-gray-500 dark:text-slate-400'>
        Page {page} of {totalPages}
      </p>
      <div className='flex gap-2'>
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className='flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all'
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className='flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all'
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
