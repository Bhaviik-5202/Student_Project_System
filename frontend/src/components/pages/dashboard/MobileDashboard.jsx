import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RecentActivity from './RecentActivity';
import UpcomingMeetings from './UpcomingMeetings';
import ProgressVisualization from './ProgressVisualization';
import SystemMetrics from './SystemMetrics';
import { exportDashboardToCSV } from '../../../utils/exportUtils';
import { toast } from 'react-hot-toast';

// Import Lucide React icons
import {
  Home as HomeIcon,
  CalendarDays as CalendarDaysIcon,
  RefreshCw as RefreshIcon,
  Plus as PlusIcon,
  Download as DownloadIcon,
  Clock as ClockIcon,
  BookOpen as BookOpenIcon,
  Flag as FlagIcon,
  FolderKanban as FolderKanbanIcon,
  AlertTriangle as ExclamationTriangleIcon,
  ChevronRight as ChevronRightIcon,
  Bell as BellIcon,
  Users as UsersIcon,
  GraduationCap as AcademicCapIcon,
  SlidersHorizontal as AdjustmentsIcon,
  ShieldCheck as ShieldCheckIcon,
  CheckCircle2 as CheckCircleIcon,
  FileText as DocumentTextIcon,
  Sparkles as SparklesIcon,
  Check as CheckIcon,
} from 'lucide-react';

// Animated Counter Hook for mobile stat cards
const useAnimatedCounter = (endValue, duration = 800) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(endValue) || 0;

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  return count;
};

// Compact Mobile Stat Card with active touch feedback (no sticky hover)
const MobileStatCard = ({ stat, index, onClick }) => {
  const numericPart = parseInt(stat.value) || 0;
  const suffix = stat.value ? stat.value.toString().replace(/[0-9]/g, '') : '';
  const animatedValue = useAnimatedCounter(numericPart, 800);
  const Icon = stat.icon;

  const colorMap = {
    blue: 'border-blue-200/80 dark:border-blue-800/80 bg-blue-50/60 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'border-green-200/80 dark:border-green-800/80 bg-green-50/60 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'border-yellow-200/80 dark:border-yellow-800/80 bg-yellow-50/60 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'border-purple-200/80 dark:border-purple-800/80 bg-purple-50/60 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    emerald: 'border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    orange: 'border-orange-200/80 dark:border-orange-800/80 bg-orange-50/60 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    cyan: 'border-cyan-200/80 dark:border-cyan-800/80 bg-cyan-50/60 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    rose: 'border-rose-200/80 dark:border-rose-800/80 bg-rose-50/60 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    indigo: 'border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    amber: 'border-amber-200/80 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  };

  const cardStyle = colorMap[stat.color] || colorMap.purple;

  return (
    <div
      onClick={onClick}
      className='relative flex flex-col justify-between rounded-2xl border bg-white p-3.5 shadow-xs transition-transform duration-150 active:scale-[0.97] active:bg-slate-50 dark:bg-slate-800/90 dark:border-slate-700/80 dark:active:bg-slate-800'
    >
      <div className='flex items-center justify-between gap-2 mb-2'>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${cardStyle}`}>
          <Icon className='h-4.5 w-4.5' />
        </div>
        <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300 truncate max-w-[90px]'>
          {stat.change}
        </span>
      </div>

      <div>
        <div className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums'>
          {animatedValue}
          {suffix}
        </div>
        <div className='text-xs font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5'>
          {stat.title}
        </div>
      </div>

      <div className='mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold text-blue-600 dark:border-slate-700/50 dark:text-blue-400'>
        <span>Details</span>
        <ChevronRightIcon className='h-3.5 w-3.5' />
      </div>
    </div>
  );
};

/**
 * MobileDashboard Component
 *
 * Comprehensive Mobile Dashboard layout including:
 * 1. Compact Welcome ("Good Morning") Card
 * 2. Role-Based Quick Access Shortcuts Grid
 * 3. Urgent Action Alerts & System Notifications
 * 4. Today's Meetings
 * 5. Overview Metrics Grid
 * 6. Project Progress Visualization
 * 7. System Telemetry
 * 8. Recent Activity
 */
const MobileDashboard = ({
  user,
  timeOfDay,
  greeting,
  isLoading,
  handleRefresh,
  dashboardData,
  upcomingDeadlines = [],
  todayMeetings = [],
  projectProgressData = [],
  statsData = {},
  recentActivities = [],
  notifications = [],
  unreadCount = 0,
  markAsRead = () => {},
  markAllAsRead = () => {},
  navigate,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Role-based Quick Access Shortcuts
  const getQuickAccessItems = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Projects', path: '/projects', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400' },
        { label: 'Students', path: '/students', icon: UsersIcon, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400' },
        { label: 'Meetings', path: '/meetings', icon: CalendarDaysIcon, color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400' },
        { label: 'Resources', path: '/resources', icon: BookOpenIcon, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400' },
        { label: 'User Admin', path: '/user-management', icon: ShieldCheckIcon, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400' },
        { label: 'System Logs', path: '/audit-log', icon: AdjustmentsIcon, color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/60 dark:text-purple-400' },
      ];
    }
    if (user?.role === 'faculty') {
      return [
        { label: 'Assigned Projects', path: '/projects', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400' },
        { label: 'Student Groups', path: '/students', icon: UsersIcon, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400' },
        { label: 'Schedule Meeting', path: '/meetings/new', icon: CalendarDaysIcon, color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400' },
        { label: 'Resources', path: '/resources', icon: BookOpenIcon, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400' },
      ];
    }
    return [
      { label: 'My Project', path: '/projects', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400' },
      { label: 'Milestones', path: '/milestones', icon: FlagIcon, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400' },
      { label: 'My Meetings', path: '/meetings', icon: CalendarDaysIcon, color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400' },
      { label: 'Resources', path: '/resources', icon: BookOpenIcon, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400' },
    ];
  };

  const quickAccessItems = getQuickAccessItems();

  return (
    <div className='w-full space-y-5 px-3 pt-2 pb-36 max-w-full overflow-x-hidden animate-fade-in'>
      {/* 1. Compact Welcome ("Good Morning") Card */}
      <div className='rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs dark:border-slate-700/90 dark:bg-slate-900'>
        {/* Top Info Row */}
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs'>
            <HomeIcon className='h-5 w-5' />
          </div>

          <div className='min-w-0 flex-1'>
            <h1 className='text-base font-bold tracking-tight text-gray-900 dark:text-gray-100 truncate'>
              {timeOfDay},{' '}
              <span className='text-blue-600 dark:text-blue-400'>
                {user?.name || 'User'}
              </span>
            </h1>
            <p className='text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5'>
              {greeting}
            </p>
          </div>
        </div>

        {/* Divider & Badge / Date Row */}
        <div className='mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 dark:border-slate-800/80'>
          <span className='inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300'>
            {user?.role === 'admin'
              ? 'Administrator'
              : user?.role === 'faculty'
              ? 'Faculty Guide'
              : 'Student Member'}
          </span>

          <span className='flex items-center text-xs font-medium text-gray-500 dark:text-gray-400'>
            <CalendarDaysIcon className='mr-1 h-3.5 w-3.5 text-gray-400' />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Action Buttons Grid */}
        <div className='mt-3.5 space-y-2'>
          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/project-types')}
                className='flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 px-4 text-xs font-bold text-white shadow-xs transition-transform duration-150 active:scale-[0.98]'
              >
                <PlusIcon className='mr-1.5 h-4 w-4' />
                <span>New Project Type</span>
              </button>

              <div className='grid grid-cols-2 gap-2'>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className='flex items-center justify-center rounded-xl border border-gray-300 bg-white py-2 px-3 text-xs font-semibold text-gray-700 shadow-2xs transition-transform duration-150 active:scale-[0.97] active:bg-gray-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:active:bg-slate-700'
                >
                  <RefreshIcon
                    className={`mr-1.5 h-3.5 w-3.5 ${
                      isLoading ? 'animate-spin' : ''
                    }`}
                  />
                  <span>{isLoading ? 'Refreshing' : 'Refresh'}</span>
                </button>

                <button
                  onClick={() => {
                    try {
                      exportDashboardToCSV(dashboardData, user?.role || 'user');
                      toast.success('Report exported successfully');
                    } catch (err) {
                      toast.error('Failed to export report');
                    }
                  }}
                  className='flex items-center justify-center rounded-xl border border-gray-300 bg-white py-2 px-3 text-xs font-semibold text-gray-700 shadow-2xs transition-transform duration-150 active:scale-[0.97] active:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:active:bg-slate-700'
                >
                  <DownloadIcon className='mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
                  <span>Export Report</span>
                </button>
              </div>
            </>
          )}

          {user?.role === 'faculty' && (
            <div className='grid grid-cols-2 gap-2'>
              <button
                onClick={() => navigate('/meetings')}
                className='flex items-center justify-center rounded-xl bg-blue-600 py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-transform duration-150 active:scale-[0.98]'
              >
                <ClockIcon className='mr-1.5 h-3.5 w-3.5' />
                <span>My Meetings</span>
              </button>

              <button
                onClick={() => navigate('/resources')}
                className='flex items-center justify-center rounded-xl border border-gray-300 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 shadow-2xs transition-transform duration-150 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200'
              >
                <BookOpenIcon className='mr-1.5 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
                <span>Resources</span>
              </button>
            </div>
          )}

          {user?.role === 'student' && (
            <div className='grid grid-cols-2 gap-2'>
              <button
                onClick={() => navigate('/meetings')}
                className='flex items-center justify-center rounded-xl bg-blue-600 py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-transform duration-150 active:scale-[0.98]'
              >
                <ClockIcon className='mr-1.5 h-3.5 w-3.5' />
                <span>My Meetings</span>
              </button>

              <button
                onClick={() => navigate('/milestones')}
                className='flex items-center justify-center rounded-xl border border-gray-300 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 shadow-2xs transition-transform duration-150 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200'
              >
                <FlagIcon className='mr-1.5 h-3.5 w-3.5 text-amber-600 dark:text-amber-400' />
                <span>Milestones</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Quick Access Shortcuts Section */}
      <div className='rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs dark:border-slate-700/90 dark:bg-slate-900'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5'>
            <SparklesIcon className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
            Quick Access
          </h2>
        </div>

        <div className='grid grid-cols-3 gap-2.5'>
          {quickAccessItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className='flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-center transition-transform duration-150 active:scale-[0.95] active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:active:bg-slate-800'
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color} mb-1.5 shadow-2xs`}>
                  <Icon className='h-4.5 w-4.5' />
                </div>
                <span className='text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate max-w-full'>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Urgent Action Alerts (If High Priority Deadline Exists) */}
      {(upcomingDeadlines?.filter((d) => d.priority === 'high')?.length || 0) > 0 && (
        <div className='rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-white p-3.5 shadow-2xs dark:border-red-900/40 dark:from-red-950/30 dark:to-slate-900'>
          <div className='flex items-start gap-2.5'>
            <ExclamationTriangleIcon className='h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <h3 className='text-xs font-bold text-gray-900 dark:text-white'>
                ⚠️ Urgent Action Required
              </h3>
              <p className='text-xs text-gray-700 dark:text-gray-300 truncate mt-0.5'>
                {upcomingDeadlines?.filter((d) => d.priority === 'high')[0]?.title}
              </p>
              <button
                onClick={() => navigate('/assignments')}
                className='mt-2 inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-2xs active:scale-[0.98]'
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. System Notifications & Alerts Banner */}
      {unreadCount > 0 && (
        <div className='rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 shadow-2xs dark:border-blue-900/40 dark:bg-blue-950/30'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <div className='relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white'>
                <BellIcon className='h-4 w-4' />
                <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white'>
                  {unreadCount}
                </span>
              </div>
              <div>
                <h4 className='text-xs font-bold text-gray-900 dark:text-white'>
                  {unreadCount} Unread Notifications
                </h4>
                <p className='text-[11px] text-gray-600 dark:text-gray-400'>
                  Stay updated with latest activities
                </p>
              </div>
            </div>

            <button
              onClick={markAllAsRead}
              className='flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700 shadow-2xs active:scale-[0.96] dark:border-blue-800 dark:bg-slate-800 dark:text-blue-300'
            >
              <CheckIcon className='h-3 w-3' />
              <span>Mark Read</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Overview Stat Metrics Cards Grid (2 Columns) */}
      {dashboardData.stats && dashboardData.stats.length > 0 && (
        <div>
          <h2 className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 px-1'>
            Overview Metrics
          </h2>
          <div className='grid grid-cols-2 gap-2.5'>
            {dashboardData.stats.map((stat, index) => (
              <MobileStatCard
                key={index}
                stat={stat}
                index={index}
                onClick={stat.onClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. Today's Meetings Section */}
      <div>
        <UpcomingMeetings
          meetings={todayMeetings.length > 0 ? todayMeetings : upcomingDeadlines}
          userRole={user?.role}
          title="Today's Meetings & Deadlines"
          emptyMessage="No meetings or deadlines scheduled for today."
        />
      </div>

      {/* 7. Project Progress Visualization Section */}
      <div className='rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs dark:border-slate-700/90 dark:bg-slate-900'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
            <FolderKanbanIcon className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            Project Progress
          </h3>
          <button
            onClick={() => navigate('/projects')}
            className='text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center'
          >
            All Projects
            <ChevronRightIcon className='h-3 w-3 ml-0.5' />
          </button>
        </div>

        <ProgressVisualization
          projects={projectProgressData}
          userRole={user?.role}
        />
      </div>

      {/* 8. System Telemetry Section */}
      <div>
        <SystemMetrics stats={statsData} />
      </div>

      {/* 9. Recent Activity Section */}
      <div className='rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs dark:border-slate-700/90 dark:bg-slate-900'>
        <RecentActivity
          activities={recentActivities}
          userRole={user?.role}
        />
      </div>
    </div>
  );
};

MobileDashboard.propTypes = {
  user: PropTypes.object,
  timeOfDay: PropTypes.string,
  greeting: PropTypes.string,
  isLoading: PropTypes.bool,
  handleRefresh: PropTypes.func.isRequired,
  dashboardData: PropTypes.object.isRequired,
  upcomingDeadlines: PropTypes.array,
  todayMeetings: PropTypes.array,
  projectProgressData: PropTypes.array,
  statsData: PropTypes.object,
  recentActivities: PropTypes.array,
  notifications: PropTypes.array,
  unreadCount: PropTypes.number,
  markAsRead: PropTypes.func,
  markAllAsRead: PropTypes.func,
  navigate: PropTypes.func.isRequired,
};

export default MobileDashboard;
