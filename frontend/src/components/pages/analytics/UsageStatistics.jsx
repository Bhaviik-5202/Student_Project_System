import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const UsageStatistics = memo(() => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [usageData, setUsageData] = useState([]);
  const [dailyUsers, setDailyUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/usage');
        const data = response.data || {};
        setStats({
          activeUsers: data.activeUsers || { current: 0, change: '0%' },
          dailyLogins: data.dailyLogins || { current: 0, change: '0%' },
          pageViews: data.pageViews || { current: 0, change: '0%' },
          storageUsed: data.storageUsed || { current: 0, change: '0%' },
        });
        setUsageData(data.usageData || []);
        setDailyUsers(data.dailyUsers || []);
      } catch (error) {
        console.error('Failed to fetch usage statistics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  const peakHours = [
    { hour: '9 AM', usage: 85 },
    { hour: '10 AM', usage: 92 },
    { hour: '11 AM', usage: 88 },
    { hour: '12 PM', usage: 78 },
    { hour: '1 PM', usage: 82 },
    { hour: '2 PM', usage: 95 },
    { hour: '3 PM', usage: 90 },
  ];

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Usage Statistics
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              System usage and engagement metrics
            </p>
          </div>
          <button className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'>
            Download Report
          </button>
        </div>

        {loading ? (
          <div className='p-8 text-center text-slate-500'>
            Loading usage statistics...
          </div>
        ) : Object.keys(stats).length === 0 ? (
          <div className='p-8 text-center text-slate-500'>
            No usage data available.
          </div>
        ) : (
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {Object.entries(stats).map(([key, metric]) => (
              <div
                key={key}
                className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'
              >
                <div className='mb-2 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                    {metric.current}
                  </div>
                  <div className='flex items-center text-sm text-emerald-600 dark:text-emerald-400'>
                    <span>{metric.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usage by Feature */}
        <div className='mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h3 className='mb-6 text-lg font-semibold text-slate-900 dark:text-white'>
            Feature Usage Distribution
          </h3>
          <div className='space-y-4'>
            {usageData.map((feature, index) => (
              <div key={index}>
                <div className='mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-400'>
                  <div className='font-medium text-slate-900 dark:text-white'>
                    {feature.feature}
                  </div>
                  <div>
                    {feature.usage}% usage ({feature.users} users)
                  </div>
                </div>
                <div className='h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
                  <div
                    className={`h-3 rounded-full ${
                      feature.usage >= 80
                        ? 'bg-emerald-500'
                        : feature.usage >= 60
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                    }`}
                    style={{ width: `${feature.usage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Trends */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Daily Active Users
            </h3>
            <div className='space-y-4'>
              {dailyUsers.map((day, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='font-medium text-slate-900 dark:text-white'>
                    {day.day}
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-3 text-slate-900 dark:text-white'>
                      {day.users}
                    </div>
                    <div
                      className={`text-sm ${
                        day.trend === 'up'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : day.trend === 'down'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {day.trend === 'up'
                        ? '↗'
                        : day.trend === 'down'
                          ? '↘'
                          : '→'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Peak Usage Hours
            </h3>
            <div className='space-y-4'>
              {peakHours.map((hour, index) => (
                <div key={index}>
                  <div className='mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-400'>
                    <span>{hour.hour}</span>
                    <span>{hour.usage}%</span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
                    <div
                      className='h-2 rounded-full bg-purple-500'
                      style={{ width: `${hour.usage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

UsageStatistics.displayName = 'UsageStatistics';

export default UsageStatistics;
