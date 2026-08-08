import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import { toast } from 'react-hot-toast';

const ExportOptions = memo(() => {
  const navigate = useNavigate();
  const [exportType, setExportType] = useState('pdf');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [includeData, setIncludeData] = useState({
    students: true,
    projects: true,
    meetings: true,
    grades: false,
  });
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);

    try {
      // Simulate real data fetching based on selected criteria
      const dataToExport = {
        exportType,
        dateRange,
        includeData,
        generatedAt: new Date().toISOString(),
      };

      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        `custom_report_export.${exportType === 'pdf' ? 'json' : exportType}`
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      toast.success(
        `Report exported successfully as ${exportType.toUpperCase()}`
      );
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setLoading(false);
    }
  }, [exportType, dateRange, includeData]);

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Export Reports'
        subtitle='Generate and download customized system data reports in PDF, Excel, or CSV formats'
        icon={Download}
      />

      <div className='max-w-3xl rounded-lg border border-gray-200 bg-white dark:bg-slate-900 p-6 dark:border-gray-700 dark:bg-gray-800'>
        <div className='space-y-8'>
          {/* Export Format */}
          <div>
            <h2 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
              Export Format
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {['pdf', 'excel', 'csv'].map((format) => (
                <button
                  key={format}
                  type='button'
                  onClick={() => setExportType(format)}
                  className={`rounded-lg border px-4 py-3 text-center transition-colors ${
                    exportType === format
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className='font-medium'>{format.toUpperCase()}</div>
                  <div className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                    {format === 'pdf' && 'Portable Document Format'}
                    {format === 'excel' && 'Microsoft Excel'}
                    {format === 'csv' && 'Comma Separated Values'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h2 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
              Date Range
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Start Date
                </label>
                <input
                  type='date'
                  className='w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700  dark:focus:ring-blue-400'
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  End Date
                </label>
                <input
                  type='date'
                  className='w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700  dark:focus:ring-blue-400'
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Include Data */}
          <div>
            <h2 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
              Include Data
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {Object.entries(includeData).map(([key, value]) => (
                <label key={key} className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={value}
                    onChange={(e) =>
                      setIncludeData({
                        ...includeData,
                        [key]: e.target.checked,
                      })
                    }
                    className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                  />
                  <span className='ml-2 capitalize text-gray-700 dark:text-gray-300'>
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className='border-t border-gray-200 pt-6 dark:border-gray-700'>
            <button
              onClick={handleExport}
              disabled={loading}
              className='flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600'
            >
              {loading ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className='mr-2 h-5 w-5' />
                  Export Report as {exportType.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ExportOptions.displayName = 'ExportOptions';

export default ExportOptions;
