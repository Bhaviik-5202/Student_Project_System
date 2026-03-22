import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

const Table = memo(({ columns = [], data = [], onRowClick }) => {
  const handleRowClick = useCallback(
    (row) => {
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  return (
    <div className='overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-950'>
      <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
        <thead className='bg-gray-50 dark:bg-gray-900'>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400'
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => handleRowClick(row)}
              className={`transition-colors ${
                onRowClick
                  ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
                  : ''
              }`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className='whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100'
                >
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ),
  data: PropTypes.arrayOf(PropTypes.object),
  onRowClick: PropTypes.func,
};

Table.defaultProps = {
  columns: [],
  data: [],
  onRowClick: null,
};

export default Table;
