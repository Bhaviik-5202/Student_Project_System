import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  FolderKanban,
  Clock,
  Activity,
  RefreshCw,
  Settings,
  CheckCircle,
  Calendar,
  ArrowRight,
  UserPlus,
  FileBarChart,
  Server,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PageHeader from '../../common/PageHeader';
import SectionHeader from '../../ui/SectionHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorState from '../../ui/ErrorState';
import StatusBadge from '../../ui/StatusBadge';
import EmptyState from '../../ui/EmptyState';
import analyticsService from '../../../services/analyticsService';
import adminService from '../../../services/adminService';
import auditlogService from '../../../services/auditlogService';
import useNotification from '../../../hooks/useNotification';
import { subscribeDataChanged } from '../../../utils/eventBus';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const MobileAdminUserCard = ({ u }) => (
  <div className='flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50'>
    <div className='flex flex-col'>
      <div className='font-bold text-slate-900 dark:text-white text-sm'>
        {u.name || 'User'}
      </div>
      <div className='text-[10px] text-slate-500 dark:text-slate-400'>
        {u.email}
      </div>
    </div>
    <div className='flex flex-col items-end gap-1.5'>
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
        u.role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : u.role === 'faculty' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      }`}>
        {u.role || 'Student'}
      </span>
      <StatusBadge status={u.status || 'active'} label={u.status || 'Active'} />
    </div>
  </div>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showSuccess, showError } = useNotification();

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, userRes, auditRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        adminService.getUsers(),
        auditlogService.getAllAuditLogs({ limit: 5 }),
      ]);

      if (dashRes.success || dashRes.data) {
        setStats(dashRes.data || {});
      }
      if (userRes.success || userRes.data) {
        setUsers(
          Array.isArray(userRes.data) ? userRes.data : userRes.data?.users || []
        );
      }
      if (auditRes.success || auditRes.data) {
        setAuditLogs(
          Array.isArray(auditRes.data)
            ? auditRes.data
            : auditRes.data?.logs || []
        );
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Unable to fetch administrative data from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Auto-refresh dashboard stats when any user/staff/project CRUD event fires
  useEffect(() => {
    const unsubscribe = subscribeDataChanged(() => {
      fetchAdminData();
    });
    return () => unsubscribe();
  }, [fetchAdminData]);

  // Fallback data if arrays are empty
  const performanceData = stats.performanceData || [];
  const activityData = stats.activityData || [];
  const todayMeetings = stats.todayMeetings || [];
  const recentActivities = stats.recentActivities || [];

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        title='Admin Control Center'
        subtitle='Global system administration, real-time analytics, user management, and security.'
        icon={ShieldCheck}
        badge='System Admin'
        actions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              icon={RefreshCw}
              onClick={fetchAdminData}
            >
              Refresh
            </Button>
            <Button
              variant='primary'
              size='sm'
              icon={Settings}
              onClick={() => (window.location.href = '/system-settings')}
            >
              Settings
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner message='Loading administrative metrics...' />
      ) : error ? (
        <ErrorState
          title='Error Loading Admin Dashboard'
          message={error}
          onRetry={fetchAdminData}
        />
      ) : (
        <>
          {/* Main System Statistics Cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatisticsCard
              title='Total System Users'
              value={stats.totalUsers || users.length || 0}
              icon={Users}
              color='indigo'
              description='Students, Faculty & Admins'
            />
            <StatisticsCard
              title='Active Projects'
              value={stats.activeProjects || stats.totalProjects || 0}
              icon={FolderKanban}
              color='blue'
              description='Currently in progress'
            />
            <StatisticsCard
              title='Pending Approvals'
              value={stats.pendingApprovals || 0}
              icon={Clock}
              color='amber'
              description='Requires admin/guide review'
            />
            <StatisticsCard
              title='System Health'
              value={
                stats.systemHealth
                  ? `${stats.systemHealth}% Operational`
                  : '100% Operational'
              }
              icon={Activity}
              color='emerald'
              description='MongoDB & Node active'
            />
          </div>

          {/* Charts Row */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800  flex flex-col'>
              <SectionHeader
                title='Performance Trends'
                description='Project completions over the last 6 months.'
              />
              <div className='mt-4 flex-1 min-h-[250px]'>
                {performanceData.length > 0 ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={performanceData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray='3 3'
                        vertical={false}
                        stroke='#e2e8f0'
                      />
                      <XAxis
                        dataKey='month'
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          backgroundColor: '#fff',
                        }}
                      />
                      <Line
                        type='monotone'
                        dataKey='projects'
                        stroke='#3b82f6'
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name='Total Projects'
                      />
                      <Line
                        type='monotone'
                        dataKey='completions'
                        stroke='#10b981'
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name='Completed'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState title='No Performance Data' icon={FileBarChart} />
                )}
              </div>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800  flex flex-col'>
              <SectionHeader
                title='Project Distribution'
                description='Current status of all system projects.'
              />
              <div className='mt-4 flex-1 flex items-center justify-center min-h-[250px]'>
                {activityData.length > 0 ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={activityData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey='count'
                        nameKey='label'
                      >
                        {activityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState title='No Activity Data' icon={FolderKanban} />
                )}
              </div>
            </div>
          </div>

          {/* Today's Meetings & Quick Actions Row */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Quick Actions */}
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
              <SectionHeader
                title='Quick Actions'
                description='Frequently used administrative tasks.'
              />
              <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                <button
                  onClick={() =>
                    (window.location.href = '/user-management/new')
                  }
                  className='flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-800 /40 dark:hover:border-indigo-900 dark:hover:bg-indigo-900/20'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'>
                    <UserPlus className='h-5 w-5' />
                  </div>
                  <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                    Add User
                  </span>
                </button>
                <button
                  onClick={() => (window.location.href = '/reports')}
                  className='flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 /40 dark:hover:border-blue-900 dark:hover:bg-blue-900/20'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'>
                    <FileBarChart className='h-5 w-5' />
                  </div>
                  <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                    View Reports
                  </span>
                </button>
                <button
                  onClick={() => (window.location.href = '/system-settings')}
                  className='flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 transition-all hover:border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700  dark:border-slate-800 /40 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 dark:bg-slate-800 dark:text-slate-400'>
                    <Server className='h-5 w-5' />
                  </div>
                  <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                    System Config
                  </span>
                </button>
                <button
                  onClick={() => (window.location.href = '/audit-log')}
                  className='flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-800 /40 dark:hover:border-emerald-900 dark:hover:bg-emerald-900/20'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'>
                    <ShieldCheck className='h-5 w-5' />
                  </div>
                  <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                    Full Audit Log
                  </span>
                </button>
              </div>
            </div>

            {/* Today's Meetings */}
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800  flex flex-col'>
              <SectionHeader
                title="Today's Meetings"
                description='Upcoming project reviews and guidance sessions.'
              />
              <div className='mt-4 flex-1 space-y-3'>
                {todayMeetings.length > 0 ? (
                  todayMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className='flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-4 dark:border-slate-800 /40'
                    >
                      <div className='flex flex-col items-center justify-center rounded-lg bg-indigo-100 px-3 py-2 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400'>
                        <span className='text-xs font-bold uppercase'>
                          {new Date(meeting.date).toLocaleDateString('en-US', {
                            month: 'short',
                          })}
                        </span>
                        <span className='text-lg font-black'>
                          {new Date(meeting.date).getDate()}
                        </span>
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-bold text-slate-900 dark:text-white'>
                          {meeting.title}
                        </h4>
                        <div className='mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {meeting.time}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Users className='h-3 w-3' />
                            {meeting.participants} Participants
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState title='No Meetings Today' icon={Calendar} />
                )}
              </div>
            </div>
          </div>

          {/* Activity Logs & User Overview Row */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* System Audit Logs */}
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800  flex flex-col'>
              <SectionHeader
                title='System Audit Trail'
                description='Real-time security and operational events.'
              />
              <div className='mt-4 flex-1 space-y-3'>
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <div
                      key={log._id || log.id}
                      className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-3.5 dark:border-slate-800 /40'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300  '>
                          <ShieldCheck className='h-4 w-4' />
                        </div>
                        <div>
                          <p className='font-semibold text-slate-900 dark:text-white text-xs'>
                            {log.action || log.activity}
                          </p>
                          <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>
                            By{' '}
                            <span className='font-medium text-slate-700 dark:text-slate-300'>
                              {log.user?.name || log.user?.email || 'System'}
                            </span>
                            {log.resource && ` • Target: ${log.resource}`}
                          </p>
                        </div>
                      </div>
                      <span className='text-[10px] font-medium text-slate-400'>
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </span>
                    </div>
                  ))
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((log) => (
                    <div
                      key={log.id}
                      className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800 p-3.5 dark:border-slate-800 /40'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'>
                          <Zap className='h-4 w-4' />
                        </div>
                        <div>
                          <p className='font-semibold text-slate-900 dark:text-white text-xs'>
                            {log.title}
                          </p>
                          <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>
                            {log.description}
                          </p>
                        </div>
                      </div>
                      <span className='text-[10px] font-medium text-slate-400'>
                        {log.updatedAt
                          ? new Date(log.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <EmptyState title='No Recent Activity' icon={ShieldCheck} />
                )}
              </div>
            </div>

            {/* Recent Registered Users */}
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
              <div className='flex items-center justify-between'>
                <SectionHeader
                  title='User Accounts'
                  description='Recently registered users.'
                />
                <button
                  onClick={() => (window.location.href = '/user-management')}
                  className='flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400'
                >
                  View All <ArrowRight className='h-3 w-3' />
                </button>
              </div>

              <div className='mt-4 hidden md:block overflow-x-auto'>
                <table className='w-full text-left text-xs text-slate-600 dark:text-slate-400'>
                  <thead className='border-b border-slate-200 bg-slate-50 dark:bg-slate-800 uppercase text-slate-500 dark:text-slate-400 dark:border-slate-800 /50'>
                    <tr>
                      <th className='py-3 px-4 font-semibold rounded-tl-xl'>
                        User
                      </th>
                      <th className='py-3 px-4 font-semibold'>Role</th>
                      <th className='py-3 px-4 font-semibold rounded-tr-xl'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
                    {users.length > 0 ? (
                      users.slice(0, 5).map((u, idx) => (
                        <tr
                          key={u.id || u._id || idx}
                          className='hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 /50 transition-colors'
                        >
                          <td className='py-3 px-4'>
                            <div className='font-bold text-slate-900 dark:text-white'>
                              {u.name || 'User'}
                            </div>
                            <div className='text-[10px] text-slate-500 dark:text-slate-400'>
                              {u.email}
                            </div>
                          </td>
                          <td className='py-3 px-4'>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : u.role === 'faculty'
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}
                            >
                              {u.role || 'Student'}
                            </span>
                          </td>
                          <td className='py-3 px-4'>
                            <StatusBadge
                              status={u.status || 'active'}
                              label={u.status || 'Active'}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan='3'
                          className='py-8 text-center text-slate-500 dark:text-slate-400'
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card Layout */}
              <div className='mt-4 block md:hidden space-y-2'>
                {users.length > 0 ? (
                  users.slice(0, 5).map((u, idx) => (
                    <MobileAdminUserCard key={u.id || u._id || idx} u={u} />
                  ))
                ) : (
                  <div className='py-8 text-center text-slate-500 dark:text-slate-400 text-xs'>
                    No users found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
