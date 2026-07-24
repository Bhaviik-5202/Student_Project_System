import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BarChart2,
  GraduationCap,
  CheckSquare,
  TrendingUp,
  Award,
  Users,
  FolderKanban,
  Clock,
  RefreshCw,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import PageHeader from '../../common/PageHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorState from '../../ui/ErrorState';
import analyticsService from '../../../services/analyticsService';
import useNotification from '../../../hooks/useNotification';

const COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

export const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({});
  const [projectAnalytics, setProjectAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('semester');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { showSuccess } = useNotification();

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, projRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getProjectAnalytics(),
      ]);

      if (dashRes.success || dashRes.data) {
        setStats(dashRes.data?.stats || dashRes.data || {});
      }
      if (projRes.success || projRes.data) {
        setProjectAnalytics(projRes.data || {});
      }
    } catch (err) {
      console.error('Failed to load analytics dashboard data:', err);
      setError(
        'Failed to fetch real-time analytics. Please check server connections.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Chart Data Processing
  const statusPieData = useMemo(() => {
    if (stats.activityData && stats.activityData.length > 0) {
      return stats.activityData.map((item) => ({
        name: item.label,
        value: item.count,
      }));
    }
    return [
      { name: 'Completed', value: stats.completedProjects || 0 },
      { name: 'In Progress', value: stats.activeProjects || 0 },
      { name: 'Under Review', value: stats.pendingApprovals || 0 },
      { name: 'Proposed', value: 0 },
    ];
  }, [stats]);

  const departmentBarData = useMemo(() => {
    if (stats.performanceData && stats.performanceData.length > 0) {
      return stats.performanceData.map((item) => ({
        dept: item.month, // Reuse the X-Axis for months to show timeline
        total: item.submissions,
        completed: item.completions,
      }));
    }
    return [];
  }, [stats]);

  const handleExport = () => {
    if (!stats) {
      setError('No data to export.');
      return;
    }
    try {
      showSuccess('Exporting analytics dashboard summary to JSON...');
      // Simple JSON export for the dashboard data
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(stats, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        'analytics_dashboard_export.json'
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (e) {
      setError('Failed to export data');
    }
  };

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        title='Analytics Dashboard'
        subtitle='Real-time academic performance intelligence, project completion velocity, and department trends.'
        icon={BarChart2}
        badge='Real-time Telemetry'
        actions={
          <div className='flex items-center gap-2'>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: 'month', label: 'This Month' },
                { value: 'semester', label: 'Fall 2026 Semester' },
                { value: 'year', label: 'Academic Year 2025-2026' },
              ]}
              className='w-44'
            />
            <Button
              variant='outline'
              size='sm'
              icon={RefreshCw}
              onClick={fetchAnalytics}
            >
              Refresh
            </Button>
            <Button
              variant='primary'
              size='sm'
              icon={Download}
              onClick={handleExport}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner message='Aggregating performance metrics...' />
      ) : error ? (
        <ErrorState
          title='Error Loading Analytics'
          message={error}
          onRetry={fetchAnalytics}
        />
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatisticsCard
              title='Total Students'
              value={stats.totalStudents || 0}
              icon={GraduationCap}
              color='indigo'
              trend={{ direction: 'up', text: '+12% this term' }}
              description='Enrolled in project courses'
            />
            <StatisticsCard
              title='Active Projects'
              value={stats.activeProjects || 0}
              icon={FolderKanban}
              color='blue'
              trend={{ direction: 'up', text: 'On track' }}
              description='Under active supervision'
            />
            <StatisticsCard
              title='Completion Rate'
              value={`${stats.completionRate || 0}%`}
              icon={TrendingUp}
              color='emerald'
              trend={{ direction: 'up', text: '+4.2% vs last year' }}
              description='On-time milestone delivery'
            />
            <StatisticsCard
              title='Faculty Guides'
              value={stats.activeFaculty || 0}
              icon={Users}
              color='amber'
              description='Active project mentors'
            />
          </div>

          {/* Charts Row 1: Status Distribution & Department Performance */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Pie Chart */}
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
              <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                Project Status Distribution
              </h3>
              <p className='mt-0.5 text-xs text-slate-500 dark:text-slate-400'>
                Breakdown of all registered student projects by current stage.
              </p>

              <div className='mt-4 h-72 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey='value'
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#ffffff',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Submission vs Completion Timeline Chart */}
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
              <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                Project Success Timeline (Last 6 Months)
              </h3>
              <p className='mt-0.5 text-xs text-slate-500 dark:text-slate-400'>
                Historical comparison of project submissions and successful
                completions.
              </p>

              <div className='mt-4 h-72 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={departmentBarData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='#e2e8f0'
                    />
                    <XAxis dataKey='dept' tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#ffffff',
                      }}
                    />
                    <Bar
                      dataKey='total'
                      name='Submissions'
                      fill='#6366f1'
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey='completed'
                      name='Completions'
                      fill='#10b981'
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
