import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RecentActivity from './RecentActivity';
import UpcomingMeetings from './UpcomingMeetings';
import ProgressVisualization from './ProgressVisualization';
import SystemMetrics from './SystemMetrics';
import { exportDashboardToCSV } from '../../../utils/exportUtils';
import { toast } from 'react-hot-toast';
import { useNotificationsContext } from '../../../context/NotificationContext';

// Import Lucide React icons
import {
  RefreshCw as RefreshIcon,
  Plus as PlusIcon,
  Download as DownloadIcon,
  Clock as ClockIcon,
  BookOpen as BookOpenIcon,
  Flag as FlagIcon,
  FolderKanban as FolderKanbanIcon,
  ChevronRight as ChevronRightIcon,
  Bell as BellIcon,
  Users as UsersIcon,
  SlidersHorizontal as AdjustmentsIcon,
  ShieldCheck as ShieldCheckIcon,
  CheckCircle2 as CheckCircleIcon,
  Sparkles as SparklesIcon,
  Check as CheckIcon,
  UserPlus,
  FolderPlus,
  ClipboardList,
  Video,
  PackageOpen,
  Send,
  MessageSquare,
  TimerOff,
  CalendarDays as CalendarDaysIcon,
} from 'lucide-react';

/**
 * MobileAlerts - Role-specific, real-data alert section
 * Uses notifications from NotificationContext for live backend data.
 */
const ROLE_ALERT_META = {
  admin: [
    { type: 'user_registered', label: 'New User Registered', icon: UserPlus, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-100 dark:border-blue-900/40' },
    { type: 'project_created', label: 'New Project Created', icon: FolderPlus, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40' },
    { type: 'approval', label: 'Pending Approval', icon: ClipboardList, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/40' },
    { type: 'meeting', label: 'Meeting Alert', icon: Video, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40' },
    { type: 'resource', label: 'Resource Update', icon: PackageOpen, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400 border-purple-100 dark:border-purple-900/40' },
    { type: 'system', label: 'System Notification', icon: ShieldCheckIcon, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800/60 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
  ],
  faculty: [
    { type: 'project', label: 'Project Assignment', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-100 dark:border-blue-900/40' },
    { type: 'submission', label: 'Student Submission', icon: Send, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40' },
    { type: 'meeting', label: 'Upcoming Meeting', icon: Video, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40' },
    { type: 'review', label: 'Pending Review', icon: ClipboardList, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/40' },
    { type: 'deadline', label: 'Deadline Reminder', icon: TimerOff, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400 border-purple-100 dark:border-purple-900/40' },
  ],
  student: [
    { type: 'project', label: 'Project Update', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-100 dark:border-blue-900/40' },
    { type: 'meeting', label: 'Meeting Invitation', icon: Video, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40' },
    { type: 'deadline', label: 'Submission Deadline', icon: TimerOff, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/40' },
    { type: 'feedback', label: 'Feedback Received', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40' },
    { type: 'resource', label: 'Resource Update', icon: PackageOpen, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400 border-purple-100 dark:border-purple-900/40' },
  ],
};

const MobileAlerts = ({ userRole, navigate }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsContext();
  const roleAlertTypes = (ROLE_ALERT_META[userRole] || []).map((m) => m.type);

  const roleNotifications = notifications
    .filter((n) => {
      if (!n) return false;
      const nType = (n.type || '').toLowerCase();
      return roleAlertTypes.some((t) => nType.includes(t)) || !n.read;
    })
    .slice(0, 6);

  const alertMeta = ROLE_ALERT_META[userRole] || [];

  const getAlertMeta = (notification) => {
    const nType = (notification.type || '').toLowerCase();
    const match = alertMeta.find((m) => nType.includes(m.type));
    return match || { icon: BellIcon, label: notification.title || 'Notification', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-100 dark:border-blue-900/40' };
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All alerts marked as read');
    } catch {
      toast.error('Failed to mark alerts as read');
    }
  };

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60 w-full overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2.5'>
          <div className='relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'>
            <BellIcon className='h-4 w-4' />
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h2 className='text-[13px] font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300'>
            Action Center
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className='flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 transition-colors active:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:active:bg-blue-500/20'
          >
            <CheckIcon className='h-3 w-3' />
            Mark All Read
          </button>
        )}
      </div>

      {/* Alert Items */}
      {roleNotifications.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-8 gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10'>
            <CheckCircleIcon className='h-6 w-6 text-emerald-500 dark:text-emerald-400' />
          </div>
          <div className='text-center'>
            <p className='text-sm font-bold text-slate-700 dark:text-slate-300'>All caught up!</p>
            <p className='text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5'>No new alerts for you.</p>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-2.5'>
          {roleNotifications.map((notif) => {
            const meta = getAlertMeta(notif);
            const Icon = meta.icon;
            const isUnread = !notif.read;
            return (
              <button
                key={notif._id || notif.id}
                onClick={() => markAsRead(notif._id || notif.id)}
                className={`w-full flex items-start gap-3.5 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${
                  isUnread
                    ? 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-transparent opacity-75'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${meta.color}`}>
                  <Icon className='h-4.5 w-4.5' />
                </div>
                <div className='min-w-0 flex-1 py-0.5'>
                  <p className={`text-[13px] font-bold truncate leading-tight ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {notif.title || meta.label}
                  </p>
                  {notif.message && (
                    <p className='text-[12px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug'>
                      {notif.message}
                    </p>
                  )}
                </div>
                {isUnread && (
                  <span className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30' />
                )}
              </button>
            );
          })}
          <button
            onClick={() => navigate('/notifications')}
            className='mt-1 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-slate-50 py-3 text-xs font-bold text-slate-600 transition-colors active:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:active:bg-slate-800'
          >
            View All Notifications
            <ChevronRightIcon className='h-3.5 w-3.5' />
          </button>
        </div>
      )}
    </div>
  );
};

// Animated Counter Hook
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

// Mobile Stat Card
const MobileStatCard = ({ stat, onClick }) => {
  const numericPart = parseInt(stat.value) || 0;
  const suffix = stat.value ? stat.value.toString().replace(/[0-9]/g, '') : '';
  const animatedValue = useAnimatedCounter(numericPart, 800);
  const Icon = stat.icon;

  const colorMap = {
    blue: 'from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30',
    green: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30',
    purple: 'from-purple-500/10 to-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30',
    orange: 'from-orange-500/10 to-orange-500/5 text-orange-600 dark:text-orange-400 border-orange-200/50 dark:border-orange-900/30',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30',
    rose: 'from-rose-500/10 to-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30',
  };

  const styleClass = colorMap[stat.color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-br ${styleClass} p-4 shadow-sm backdrop-blur-sm transition-all active:scale-[0.96]`}
    >
      <div className='flex items-start justify-between gap-2 mb-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/60 shadow-sm backdrop-blur-md dark:bg-slate-900/50'>
          <Icon className='h-5 w-5' />
        </div>
        {stat.change && (
          <div className='flex items-center rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur-md dark:bg-slate-900/60 dark:text-slate-300'>
            {stat.change}
          </div>
        )}
      </div>

      <div className='mt-1'>
        <div className='text-3xl font-black tracking-tight text-slate-900 dark:text-white'>
          {animatedValue}{suffix}
        </div>
        <div className='mt-0.5 text-[12px] font-semibold text-slate-600 dark:text-slate-400 line-clamp-1'>
          {stat.title}
        </div>
      </div>
    </div>
  );
};

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
  navigate,
}) => {

  const getQuickAccessItems = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Projects', path: '/projects', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-100/80 dark:bg-blue-500/10' },
        { label: 'Students', path: '/students', icon: UsersIcon, color: 'text-emerald-600 bg-emerald-100/80 dark:bg-emerald-500/10' },
        { label: 'Meetings', path: '/meetings', icon: CalendarDaysIcon, color: 'text-rose-600 bg-rose-100/80 dark:bg-rose-500/10' },
        { label: 'Resources', path: '/resources', icon: BookOpenIcon, color: 'text-amber-600 bg-amber-100/80 dark:bg-amber-500/10' },
        { label: 'Users', path: '/user-management', icon: ShieldCheckIcon, color: 'text-indigo-600 bg-indigo-100/80 dark:bg-indigo-500/10' },
        { label: 'Logs', path: '/audit-log', icon: AdjustmentsIcon, color: 'text-purple-600 bg-purple-100/80 dark:bg-purple-500/10' },
      ];
    }
    if (user?.role === 'faculty') {
      return [
        { label: 'Projects', path: '/projects', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-100/80 dark:bg-blue-500/10' },
        { label: 'Students', path: '/students', icon: UsersIcon, color: 'text-emerald-600 bg-emerald-100/80 dark:bg-emerald-500/10' },
        { label: 'Schedule', path: '/meetings/new', icon: CalendarDaysIcon, color: 'text-rose-600 bg-rose-100/80 dark:bg-rose-500/10' },
        { label: 'Resources', path: '/resources', icon: BookOpenIcon, color: 'text-amber-600 bg-amber-100/80 dark:bg-amber-500/10' },
      ];
    }
    return [
      { label: 'My Project', path: '/projects', icon: FolderKanbanIcon, color: 'text-blue-600 bg-blue-100/80 dark:bg-blue-500/10' },
      { label: 'Milestones', path: '/milestones', icon: FlagIcon, color: 'text-amber-600 bg-amber-100/80 dark:bg-amber-500/10' },
      { label: 'Meetings', path: '/meetings', icon: CalendarDaysIcon, color: 'text-rose-600 bg-rose-100/80 dark:bg-rose-500/10' },
      { label: 'Resources', path: '/resources', icon: BookOpenIcon, color: 'text-emerald-600 bg-emerald-100/80 dark:bg-emerald-500/10' },
    ];
  };

  const quickAccessItems = getQuickAccessItems();

  return (
    <div className='w-full max-w-full overflow-x-hidden pb-8 space-y-5 flex flex-col'>
      {/* 1. Glassmorphism Welcome Card */}
      <div className='relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/90 via-white/80 to-indigo-50/90 p-5 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-900/90'>
        <div className='absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl pointer-events-none' />
        <div className='absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none' />

        <div className='relative z-10 flex items-center justify-between'>
          <div className='flex items-center gap-3.5'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'>
              <span className='text-lg font-black uppercase tracking-wider'>
                {user?.name ? user.name.charAt(0) : 'U'}
              </span>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-lg font-extrabold tracking-tight text-slate-900 dark:text-white line-clamp-1'>
                {timeOfDay},{' '}
                <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300'>
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </h1>
              <p className='text-[13px] font-semibold text-slate-500 dark:text-slate-400'>
                {greeting}
              </p>
            </div>
          </div>
        </div>

        {/* Badges / Action Row */}
        <div className='relative z-10 mt-5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar'>
          <div className='inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md dark:bg-slate-900/60 dark:text-slate-300'>
            <SparklesIcon className='h-3.5 w-3.5 text-amber-500' />
            {user?.role === 'admin' ? 'Administrator' : user?.role === 'faculty' ? 'Faculty Guide' : 'Student'}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className='inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md transition-transform active:scale-95 disabled:opacity-50 dark:bg-slate-900/60 dark:text-slate-300'
          >
            <RefreshIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Action Buttons Grid */}
        <div className='relative z-10 mt-4 grid grid-cols-2 gap-2.5'>
          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/project-types')}
                className='flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 px-4 text-[13px] font-bold text-white shadow-md shadow-slate-900/20 transition-transform active:scale-[0.97] dark:bg-white dark:text-slate-900 dark:shadow-white/10'
              >
                <PlusIcon className='h-4 w-4' />
                New Type
              </button>
              <button
                onClick={() => exportDashboardToCSV(dashboardData, user?.role)}
                className='flex w-full items-center justify-center gap-2 rounded-2xl bg-white/80 py-3 px-4 text-[13px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-transform active:scale-[0.97] dark:bg-slate-900/60 dark:text-slate-200'
              >
                <DownloadIcon className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                Export
              </button>
            </>
          )}
          {user?.role === 'faculty' && (
            <>
              <button
                onClick={() => navigate('/meetings')}
                className='flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 px-4 text-[13px] font-bold text-white shadow-md shadow-slate-900/20 transition-transform active:scale-[0.97] dark:bg-white dark:text-slate-900 dark:shadow-white/10'
              >
                <ClockIcon className='h-4 w-4' />
                Meetings
              </button>
              <button
                onClick={() => navigate('/resources')}
                className='flex w-full items-center justify-center gap-2 rounded-2xl bg-white/80 py-3 px-4 text-[13px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-transform active:scale-[0.97] dark:bg-slate-900/60 dark:text-slate-200'
              >
                <BookOpenIcon className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                Resources
              </button>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <button
                onClick={() => navigate('/meetings')}
                className='flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 px-4 text-[13px] font-bold text-white shadow-md shadow-slate-900/20 transition-transform active:scale-[0.97] dark:bg-white dark:text-slate-900 dark:shadow-white/10'
              >
                <ClockIcon className='h-4 w-4' />
                Meetings
              </button>
              <button
                onClick={() => navigate('/milestones')}
                className='flex w-full items-center justify-center gap-2 rounded-2xl bg-white/80 py-3 px-4 text-[13px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-transform active:scale-[0.97] dark:bg-slate-900/60 dark:text-slate-200'
              >
                <FlagIcon className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                Milestones
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Quick Access Carousel */}
      <div className='w-full'>
        <h2 className='mb-3 pl-1 text-[13px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-3 min-[380px]:grid-cols-4 gap-2.5 w-full pb-2'>
          {quickAccessItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className='flex flex-col items-center justify-center gap-2 rounded-[1.25rem] bg-white p-3 shadow-sm transition-transform active:scale-95 dark:bg-slate-800 w-full'
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
                  <Icon className='h-5 w-5' />
                </div>
                <span className='text-[11px] font-bold text-slate-700 dark:text-slate-300'>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Action Center (Alerts) */}
      <MobileAlerts userRole={user?.role} navigate={navigate} />

      {/* 4. Overview Metrics Grid */}
      {dashboardData.stats && dashboardData.stats.length > 0 && (
        <div className='w-full'>
          <h2 className='mb-3 pl-1 text-[13px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
            Overview
          </h2>
          <div className='grid grid-cols-2 gap-3'>
            {dashboardData.stats.map((stat, index) => (
              <MobileStatCard
                key={index}
                stat={stat}
                onClick={stat.onClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Project Progress Visualization Section */}
      <div className='w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900'>
        <div className='flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800'>
          <h3 className='text-[14px] font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2'>
            <FolderKanbanIcon className='h-4.5 w-4.5 text-blue-500' />
            Project Progress
          </h3>
          <button
            onClick={() => navigate('/projects')}
            className='text-[11px] font-bold text-blue-600 transition-colors active:text-blue-700 dark:text-blue-400'
          >
            View All
          </button>
        </div>
        <div className='p-4'>
          <ProgressVisualization projects={projectProgressData} userRole={user?.role} />
        </div>
      </div>

      {/* 6. Today's Meetings */}
      <div className='w-full overflow-hidden'>
        <UpcomingMeetings
          meetings={todayMeetings.length > 0 ? todayMeetings : upcomingDeadlines}
          userRole={user?.role}
          title="Today's Agenda"
          emptyMessage="Your schedule is clear for today."
        />
      </div>

      {/* 7. System Telemetry */}
      <div className='w-full overflow-hidden'>
        <SystemMetrics stats={statsData} />
      </div>

      {/* 8. Recent Activity */}
      <div className='w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900'>
        <RecentActivity activities={recentActivities} userRole={user?.role} />
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
  navigate: PropTypes.func.isRequired,
};

export default MobileDashboard;
