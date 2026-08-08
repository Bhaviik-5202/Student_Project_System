import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Download, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';

const formatLabel = (str) =>
  str
    ? str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
    : '';

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
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Usage Statistics'
        subtitle='System usage, user activity peak hours, and engagement metrics'
        icon={LineChart}
        actions={
          <button className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'>
            <Download size={16} />
            Download Report
          </button>
        }
      />

      {loading ? (
        <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
          Loading usage statistics...
        </div>
      ) : Object.keys(stats).length === 0 ? (
        <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
          No usage data available.
        </div>
      ) : (
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {Object.entries(stats).map(([key, metric]) => (
            <div
              key={key}
              className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'
            >
              <div className='mb-2 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                {formatLabel(key)}
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
      <div className='mb-8 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
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
        <div className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
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
                      ? <TrendingUp size={16} />
                      : day.trend === 'down'
                        ? <TrendingDown size={16} />
                        : <ArrowRight size={16} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
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
  );
});

UsageStatistics.displayName = 'UsageStatistics';

export default UsageStatistics;
