import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const getColorHex = (color) => {
  const colorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
  };
  return colorMap[color] || '#3b82f6';
};

const ProgressVisualization = memo(({ projects = [], userRole = 'student' }) => {
  const chartData = projects
    .filter((project) => project && (project.name || project.title))
    .map((project) => ({
      name: project.name || project.title,
      progress: project.progress || 0,
      color: getColorHex(project.color),
      status: project.status || 'In Progress',
    }));

  return (
    <div className='flex flex-col h-full space-y-4'>
      {chartData.length > 0 ? (
        <div className='h-72 w-full'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                formatter={(value) => [`${value}%`, 'Progress']}
              />
              <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className='py-12 flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400'>
          No project progress data found.
        </div>
      )}
    </div>
  );
});

ProgressVisualization.displayName = 'ProgressVisualization';

ProgressVisualization.propTypes = {
  projects: PropTypes.array,
  userRole: PropTypes.oneOf(['student', 'faculty', 'admin']),
};

export default ProgressVisualization;
