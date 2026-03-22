import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const PerformanceMetrics = memo(() => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/performance');
        setMetrics(response.data || {});
      } catch (error) {
        console.error('Failed to fetch performance metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Performance Metrics
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              Track and analyze performance indicators
            </p>
          </div>
          <div className='flex gap-2'>
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-3 py-1 text-sm capitalize ${
                  timeRange === range
                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className='p-8 text-center text-slate-500'>
            Loading performance metrics...
          </div>
        ) : Object.keys(metrics).length === 0 ? (
          <div className='p-8 text-center text-slate-500'>
            No performance data available.
          </div>
        ) : (
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {Object.entries(metrics)
              .filter(([key]) => key !== 'trends')
              .map(([key, metric]) => (
                <div
                  key={key}
                  className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'
                >
                  <div className='mb-4 flex items-start justify-between'>
                    <div>
                      <div className='text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </div>
                      <div className='mt-1 text-2xl font-bold text-slate-900 dark:text-white'>
                        {metric.current}%
                      </div>
                    </div>
                    <div
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        metric.trend === 'up'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {metric.trend === 'up' ? '↑ Improving' : '→ Stable'}
                    </div>
                  </div>
                  <div className='mb-3'>
                    <div className='mb-1 flex justify-between text-sm'>
                      <span>Progress</span>
                      <span>
                        {metric.current}% / {metric.target}%
                      </span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-slate-200'>
                      <div
                        className='h-2 rounded-full bg-blue-500'
                        style={{
                          width: `${(metric.current / metric.target) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Performance Chart */}
        <div className='mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h3 className='mb-6 text-lg font-semibold text-slate-900 dark:text-white'>
            Performance Trends
          </h3>
          <div className='space-y-8'>
            <div className='mb-2 flex justify-end gap-6'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-sm bg-blue-500'></div>
                <span className='text-xs text-slate-500'>Overall</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-sm bg-emerald-500'></div>
                <span className='text-xs text-slate-500'>Attendance</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-sm bg-purple-500'></div>
                <span className='text-xs text-slate-500'>Assignments</span>
              </div>
            </div>

            {(
              metrics.trends || [
                { month: 'Sep', overall: 0, attendance: 0, assignments: 0 },
                { month: 'Oct', overall: 0, attendance: 0, assignments: 0 },
                { month: 'Nov', overall: 0, attendance: 0, assignments: 0 },
                { month: 'Dec', overall: 0, attendance: 0, assignments: 0 },
                { month: 'Jan', overall: 0, attendance: 0, assignments: 0 },
              ]
            ).map((data, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex justify-between text-xs text-slate-500 dark:text-slate-400'>
                  <span className='w-12 font-semibold text-slate-700 dark:text-slate-300'>
                    {data.month}
                  </span>
                  <div className='flex gap-4'>
                    <span>O: {data.overall}%</span>
                    <span>A: {data.attendance}%</span>
                    <span>S: {data.assignments}%</span>
                  </div>
                </div>
                <div className='space-y-1'>
                  <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/50'>
                    <div
                      className='h-full rounded-full bg-blue-500 transition-all duration-500'
                      style={{ width: `${data.overall}%` }}
                    ></div>
                  </div>
                  <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/50'>
                    <div
                      className='h-full rounded-full bg-emerald-500 transition-all duration-500'
                      style={{ width: `${data.attendance}%` }}
                    ></div>
                  </div>
                  <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/50'>
                    <div
                      className='h-full rounded-full bg-purple-500 transition-all duration-500'
                      style={{ width: `${data.assignments}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';

export default PerformanceMetrics;
