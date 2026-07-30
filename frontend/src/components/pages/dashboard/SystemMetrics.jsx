import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * SystemMetrics Component
 *
 * Displays live system telemetry and performance indicators in an Area Chart.
 */
const SystemMetrics = memo(({ stats = {} }) => {
  const data = stats.telemetry || stats.chartData || [];

  return (
    <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 flex flex-col h-full'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
            <i className='fas fa-chart-line mr-2 text-blue-600'></i>
            System Telemetry
          </h3>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Performance vs Active Users (Live)
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'>
            LIVE
          </span>
          <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-500'></div>
        </div>
      </div>

      <div className='flex-1 min-h-[250px] w-full flex items-center justify-center'>
        {data.length === 0 ? (
          <div className='text-center p-6 text-slate-400 dark:text-slate-500 text-sm'>
            No live telemetry data recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id='colorPerformance' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#e2e8f0'
              opacity={0.5}
            />
            <XAxis
              dataKey='time'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <Area
              type='monotone'
              dataKey='performance'
              name='Performance (%)'
              stroke='#3b82f6'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorPerformance)'
            />
            <Area
              type='monotone'
              dataKey='users'
              name='Active Users'
              stroke='#10b981'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorUsers)'
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className='mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-700'>
        <div className='flex flex-col'>
          <span className='text-[10px] font-semibold text-slate-500 uppercase tracking-wider'>
            Avg Performance
          </span>
          <span className='text-xl font-bold text-blue-600 dark:text-blue-400'>
            {stats.systemPerformance ? `${stats.systemPerformance}%` : 'N/A'}
          </span>
        </div>
        <div className='flex flex-col items-end'>
          <span className='text-[10px] font-semibold text-slate-500 uppercase tracking-wider'>
            Active Users
          </span>
          <span className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>
            {stats.activeUsers !== undefined ? stats.activeUsers : 0}
          </span>
        </div>
      </div>
    </div>
  );
});

SystemMetrics.displayName = 'SystemMetrics';

SystemMetrics.propTypes = {
  stats: PropTypes.object,
};

export default SystemMetrics;
