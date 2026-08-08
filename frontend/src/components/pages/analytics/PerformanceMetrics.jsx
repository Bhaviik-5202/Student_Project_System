import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Target,
  Users,
  RefreshCw,
  BarChart2,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorState from '../../ui/ErrorState';
import analyticsService from '../../../services/analyticsService';
import api from '../../../utils/api';

export const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [perfRes, progRes] = await Promise.all([
        analyticsService.getPerformanceMetrics(),
        api.get('/analytics/progress').catch(() => ({ data: { data: [] } })),
      ]);

      if (perfRes.success || perfRes.data) {
        setMetrics(perfRes.data || {});
      } else {
        setError(perfRes.message || 'Failed to fetch performance metrics.');
      }

      if (progRes.data?.success || progRes.data?.data) {
        setProgressData(progRes.data?.data || []);
      }
    } catch (err) {
      setError('Error connecting to performance service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  const defaultKpis = [
    {
      title: 'Project Completion Rate',
      value: metrics.completionRate || '0%',
      target: '90% Target',
      icon: CheckCircle,
      color: 'emerald',
      trend: { direction: 'up', text: '+3.2% this month' },
    },
    {
      title: 'Student Submission Rate',
      value: metrics.submissionRate || '0%',
      target: '85% Target',
      icon: Clock,
      color: 'indigo',
      trend: { direction: 'up', text: 'Above target' },
    },
    {
      title: 'Total Projects',
      value: metrics.totalProjects || 0,
      target: 'Active & Completed',
      icon: Target,
      color: 'blue',
      trend: { direction: 'up', text: 'System load' },
    },
    {
      title: 'Faculty Engagement',
      value: metrics.totalFaculty || 0,
      target: 'Active Mentors',
      icon: Users,
      color: 'amber',
      trend: { direction: 'up', text: 'Participation' },
    },
  ];

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        title='Performance Metrics'
        subtitle='Quantitative key performance indicators (KPIs), milestone adherence, and evaluation scores.'
        icon={TrendingUp}
        badge='Academic Quality'
        actions={
          <div className='flex items-center gap-2'>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'Academic Year' },
              ]}
              className='w-36'
            />
            <Button
              variant='outline'
              size='sm'
              icon={RefreshCw}
              onClick={fetchPerformance}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner message='Calculating performance indicators...' />
      ) : error ? (
        <ErrorState
          title='Failed to Load Performance Metrics'
          message={error}
          onRetry={fetchPerformance}
        />
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {defaultKpis.map((kpi, idx) => (
              <StatisticsCard
                key={idx}
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                color={kpi.color}
                trend={kpi.trend}
                description={kpi.target}
              />
            ))}
          </div>

          {/* Project Progress Trackers Table */}
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                  Active Project Progress Trackers
                </h3>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  Real-time health check of ongoing student projects and
                  completion timelines.
                </p>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full text-left text-sm text-slate-600 dark:text-slate-400'>
                <thead className='border-b border-slate-200 bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 dark:border-slate-800 /50 '>
                  <tr>
                    <th className='px-6 py-3.5 font-semibold'>Project Title</th>
                    <th className='px-6 py-3.5 font-semibold'>Team Size</th>
                    <th className='px-6 py-3.5 font-semibold'>Completion %</th>
                    <th className='px-6 py-3.5 font-semibold'>
                      Timeline Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
                  {progressData.length === 0 ? (
                    <tr>
                      <td
                        colSpan='4'
                        className='px-6 py-8 text-center text-slate-500 dark:text-slate-400'
                      >
                        No active project data available.
                      </td>
                    </tr>
                  ) : (
                    progressData.map((project, idx) => (
                      <tr
                        key={idx}
                        className='hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 /50'
                      >
                        <td className='px-6 py-4 font-bold text-slate-900 dark:text-white'>
                          {project.title}
                        </td>
                        <td className='px-6 py-4 font-semibold text-slate-700 dark:text-slate-300'>
                          {project.teamSize} Member(s)
                        </td>
                        <td className='px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400'>
                          <div className='flex items-center gap-2'>
                            <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 max-w-[100px]'>
                              <div
                                className='bg-indigo-600 h-2 rounded-full'
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span>{project.progress}%</span>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              project.timeline === 'On Track' ||
                              project.timeline === 'Ahead'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : project.timeline === 'Behind Schedule'
                                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                  : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            }`}
                          >
                            {project.timeline}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className='block md:hidden space-y-4'>
              {progressData.length === 0 ? (
                <div className='text-center py-8 text-slate-500'>
                  No active project data available.
                </div>
              ) : (
                progressData.map((project, idx) => (
                  <div
                    key={idx}
                    className='flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/40'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='font-bold text-slate-900 dark:text-white leading-tight'>
                        {project.title}
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          project.timeline === 'On Track' ||
                          project.timeline === 'Ahead'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : project.timeline === 'Behind Schedule'
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                        }`}
                      >
                        {project.timeline}
                      </span>
                    </div>

                    <div className='flex items-center justify-between text-xs'>
                      <span className='font-semibold text-slate-600 dark:text-slate-300'>
                        {project.teamSize} Member(s)
                      </span>
                      <span className='font-bold text-indigo-600 dark:text-indigo-400'>
                        {project.progress}% Completed
                      </span>
                    </div>

                    <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1'>
                      <div
                        className='bg-indigo-600 h-2 rounded-full'
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceMetrics;
