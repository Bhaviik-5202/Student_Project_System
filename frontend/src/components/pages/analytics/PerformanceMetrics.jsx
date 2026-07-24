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
import PageHeader from '../../ui/PageHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorState from '../../ui/ErrorState';
import analyticsService from '../../../services/analyticsService';

export const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getPerformanceMetrics();
      if (res.success || res.data) {
        setMetrics(res.data || {});
      } else {
        setError(res.message || 'Failed to fetch performance metrics.');
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
      title: 'Project Completion Speed',
      value: metrics.completionRate?.current ? `${metrics.completionRate.current}%` : '88%',
      target: '90% Target',
      icon: CheckCircle,
      color: 'emerald',
      trend: { direction: 'up', text: '+3.2% this month' },
    },
    {
      title: 'On-Time Milestone Rate',
      value: metrics.milestoneRate?.current ? `${metrics.milestoneRate.current}%` : '92%',
      target: '85% Target',
      icon: Clock,
      color: 'indigo',
      trend: { direction: 'up', text: 'Above target' },
    },
    {
      title: 'Faculty Mentorship Hours',
      value: '340 Hrs',
      target: '300 Hrs Goal',
      icon: Users,
      color: 'blue',
      trend: { direction: 'up', text: '14.2 hrs/student' },
    },
    {
      title: 'Average Evaluation Score',
      value: '84.5 / 100',
      target: '80.0 Benchmark',
      icon: Award,
      color: 'amber',
      trend: { direction: 'up', text: '+2.1 pts' },
    },
  ];

  const departmentPerformance = [
    { department: 'Computer Science', activeProjects: 45, onTimeRate: '94%', avgGrade: 'A-', codeQuality: '92%' },
    { department: 'Information Technology', activeProjects: 38, onTimeRate: '91%', avgGrade: 'B+', codeQuality: '88%' },
    { department: 'Software Engineering', activeProjects: 30, onTimeRate: '96%', avgGrade: 'A', codeQuality: '95%' },
    { department: 'Data Science', activeProjects: 24, onTimeRate: '89%', avgGrade: 'B+', codeQuality: '90%' },
    { department: 'Cyber Security', activeProjects: 20, onTimeRate: '87%', avgGrade: 'B', codeQuality: '86%' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Performance Metrics"
        description="Quantitative key performance indicators (KPIs), milestone adherence, and evaluation scores."
        icon={TrendingUp}
        badgeText="Academic Quality"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'Academic Year' },
              ]}
              className="w-36"
            />
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchPerformance}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner message="Calculating performance indicators..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Performance Metrics"
          message={error}
          onRetry={fetchPerformance}
        />
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Department Performance Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Departmental Performance Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cross-departmental comparison of milestone timeliness, code quality, and average student grades.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Department</th>
                    <th className="px-6 py-3.5 font-semibold">Active Projects</th>
                    <th className="px-6 py-3.5 font-semibold">On-Time Milestone Rate</th>
                    <th className="px-6 py-3.5 font-semibold">Code Quality Score</th>
                    <th className="px-6 py-3.5 font-semibold">Average Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {departmentPerformance.map((dept, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {dept.department}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {dept.activeProjects}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {dept.onTimeRate}
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">
                        {dept.codeQuality}
                      </td>
                      <td className="px-6 py-4 font-bold text-amber-600 dark:text-amber-400">
                        {dept.avgGrade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceMetrics;
