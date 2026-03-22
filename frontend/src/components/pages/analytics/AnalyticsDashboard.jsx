import { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, CheckSquare, TrendingUp, Percent } from 'lucide-react';
import analyticsService from '../../../services/analyticsService';

/**
 * AnalyticsDashboard Component
 *
 * A comprehensive performance intelligence center. Aggregates and
 * visualizes student progress, project completion rates, and
 * longitudinal performance metrics using interactive data tables
 * and color-coded activity breakdowns.
 */
const AnalyticsDashboard = memo(() => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await analyticsService.getDashboardStats();
        const data = response?.data || {};
        setStats(data.stats || {});
        setPerformanceData(data.performanceData || []);
        setActivityData(data.activityData || []);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Analytics Dashboard
            </h1>
            <p className='mt-1 text-slate-600 dark:text-slate-400'>
              System performance and analytics overview
            </p>
          </div>
        </div>

        {loading ? (
          <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
            Loading analytics...
          </div>
        ) : error ? (
          <div className='p-8 text-center text-red-500'>{error}</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              {/* Total Students */}
              <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
                <div className='flex items-center'>
                  <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                    <GraduationCap
                      className='text-blue-600 dark:text-blue-400'
                      size={24}
                    />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {stats.totalStudents || 0}
                    </div>
                    <div className='text-slate-500 dark:text-slate-400'>
                      Total Students
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Projects */}
              <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
                <div className='flex items-center'>
                  <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30'>
                    <CheckSquare
                      className='text-green-600 dark:text-green-400'
                      size={24}
                    />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {stats.activeProjects || 0}
                    </div>
                    <div className='text-slate-500 dark:text-slate-400'>
                      Active Projects
                    </div>
                  </div>
                </div>
              </div>

              {/* Avg Grade */}
              <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
                <div className='flex items-center'>
                  <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30'>
                    <TrendingUp
                      className='text-yellow-600 dark:text-yellow-400'
                      size={24}
                    />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {stats.avgGrade || 0}
                    </div>
                    <div className='text-slate-500 dark:text-slate-400'>
                      Average Grade
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
                <div className='flex items-center'>
                  <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
                    <Percent
                      className='text-purple-600 dark:text-purple-400'
                      size={24}
                    />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {stats.completionRate || 0}%
                    </div>
                    <div className='text-slate-500 dark:text-slate-400'>
                      Completion Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Table */}
            <div className='mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Project Performance Over Time
              </h3>

              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-700'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                        Month
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                        Projects
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                        Avg. Grade
                      </th>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800'>
                    {performanceData.map((row, index) => (
                      <tr key={row.month || index}>
                        <td className='px-4 py-2 font-medium text-slate-900 dark:text-white'>
                          {row.month}
                        </td>
                        <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                          {row.projects}
                        </td>
                        <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                          {row.grades}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Breakdown */}
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Activity Breakdown
              </h3>

              <div className='flex flex-wrap gap-4'>
                {activityData.map((activity, index) => (
                  <div
                    key={activity.label || index}
                    className={`flex flex-col items-center rounded-lg border border-slate-200 p-4 shadow-sm dark:border-slate-700 ${activity.color}`}
                  >
                    <span className='text-2xl font-bold text-white'>
                      {activity.value}%
                    </span>
                    <span className='text-sm font-medium text-white'>
                      {activity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

export default AnalyticsDashboard;
