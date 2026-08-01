/**
 * Dashboard Component
 *
 * The main landing page for authenticated users (Admin, Faculty, Student).
 * Displays role-specific statistics, recent activity, upcoming meetings,
 * and performance visualizations. Uses animated counters and premium
 * tailwind styling for a high-quality user experience.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotificationsContext } from '../../../context/NotificationContext';
import { toast } from 'react-hot-toast';
import RecentActivity from './RecentActivity';
import UpcomingMeetings from './UpcomingMeetings';
import ProgressVisualization from './ProgressVisualization';
import SystemMetrics from './SystemMetrics';
import analyticsService from '../../../services/analyticsService';
import { exportDashboardToCSV } from '../../../utils/exportUtils';
import api from '../../../utils/api';
import { timeAgo } from '../../../utils/helpers';
import { subscribeDataChanged } from '../../../utils/eventBus';
import { DashboardSkeleton } from '../../common/Skeleton';

// Import icons from lucide-react
import {
  BarChart3 as ChartBarIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Clipboard as ClipboardIcon,
  ClipboardList as ClipboardListIcon,
  GraduationCap as AcademicCapIcon,
  Flame as FireIcon,
  Trophy as TrophyIcon,
  CheckCircle2 as CheckCircleIcon,
  AlertTriangle as ExclamationTriangleIcon,
  ArrowUp as ArrowUpIcon,
  ArrowRight as ArrowRightIcon,
  Plus as PlusIcon,
  ArrowDown as ArrowDownIcon,
  User as UserIcon,
  MapPin as LocationMarkerIcon,
  RefreshCw as RefreshIcon,
  Download as DownloadIcon,
  ChevronRight as ChevronRightIcon,
  Bell as BellIcon,
  Settings as CogIcon,
  Info as InformationCircleIcon,
  Server as ServerIcon,
  Zap as BoltIcon,
  ShieldCheck as ShieldCheckIcon,
  PieChart as ChartPieIcon,
  Lightbulb as LightBulbIcon,
  Home as HomeIcon,
  BookOpen as BookOpenIcon,
  Users2 as UserGroupIcon,
  FileText as DocumentTextIcon,
  CalendarDays as CalendarDaysIcon,
  TrendingUp as ChartLineIcon,
  SlidersHorizontal as AdjustmentsIcon,
  BarChart2 as ChartBarSquareIcon,
  Trash2 as TrashIcon,
  Flag as FlagIcon,
  FolderKanban as FolderKanbanIcon,
} from 'lucide-react';

// --- Custom Hooks ---
// Animated Counter Hook for stat values (same as AdminDashboard)
const useAnimatedCounter = (endValue, duration = 1000) => {
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

// Animated Stat Card Component
const AnimatedStatCard = ({ stat, index, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const numericPart = parseInt(stat.value) || 0;
  const suffix = stat.value ? stat.value.toString().replace(/[0-9]/g, '') : '';
  const animatedValue = useAnimatedCounter(isVisible ? numericPart : 0, 1200);
  const Icon = stat.icon;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const colorMap = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20',
      hoverBg: 'bg-blue-50/50 dark:bg-blue-900/10',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-800',
      progress: 'bg-blue-500 dark:bg-blue-400',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20',
      hoverBg: 'bg-green-50/50 dark:bg-green-900/10',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-100 dark:border-green-800',
      progress: 'bg-green-500 dark:bg-green-400',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20',
      hoverBg: 'bg-yellow-50/50 dark:bg-yellow-900/10',
      icon: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-100 dark:border-yellow-800',
      progress: 'bg-yellow-500 dark:bg-yellow-400',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20',
      hoverBg: 'bg-purple-50/50 dark:bg-purple-900/10',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-800',
      progress: 'bg-purple-500 dark:bg-purple-400',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20',
      hoverBg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-800',
      progress: 'bg-emerald-500 dark:bg-emerald-400',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20',
      hoverBg: 'bg-orange-50/50 dark:bg-orange-900/10',
      icon: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-100 dark:border-orange-800',
      progress: 'bg-orange-500 dark:bg-orange-400',
    },
    cyan: {
      bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/30 dark:to-cyan-800/20',
      hoverBg: 'bg-cyan-50/50 dark:bg-cyan-900/10',
      icon: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-100 dark:border-cyan-800',
      progress: 'bg-cyan-500 dark:bg-cyan-400',
    },
    rose: {
      bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-800/20',
      hoverBg: 'bg-rose-50/50 dark:bg-rose-900/10',
      icon: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-800',
      progress: 'bg-rose-500 dark:bg-rose-400',
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20',
      hoverBg: 'bg-indigo-50/50 dark:bg-indigo-900/10',
      icon: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-800',
      progress: 'bg-indigo-500 dark:bg-indigo-400',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20',
      hoverBg: 'bg-amber-50/50 dark:bg-amber-900/10',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-800',
      progress: 'bg-amber-500 dark:bg-amber-400',
    },
  };

  const currentColors = colorMap[stat.color] || colorMap.purple; // fallback

  const bgColor = currentColors.bg;
  const hoverBg = currentColors.hoverBg;
  const iconColor = currentColors.icon;
  const borderColor = currentColors.border;
  const progressColor = currentColors.progress;

  return (
    <div
      className={`group relative rounded-3xl border border-slate-100/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 cursor-pointer overflow-hidden transition-all duration-300 ${isVisible
        ? 'translate-y-0 opacity-100 hover:shadow-md'
        : 'translate-y-4 opacity-0'
        }`}
      onClick={onClick}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 ${hoverBg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className='relative z-10 space-y-3'>
        <div className='flex items-center justify-between'>
          <div
            className={`h-11 w-11 shrink-0 ${bgColor} flex items-center justify-center rounded-2xl border ${borderColor}`}
          >
            <Icon
              className={`h-5 w-5 ${iconColor} transform transition-transform duration-300 group-hover:scale-110`}
            />
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${stat.trend === 'up'
              ? 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
              : stat.trend === 'attention'
                ? 'bg-amber-100/90 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                : 'bg-blue-100/90 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
              }`}
          >
            {stat.change}
          </span>
        </div>

        <div>
          <div className='text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight'>
            {animatedValue}
            {suffix}
          </div>
          <div className='mt-0.5 text-sm font-bold text-slate-600 dark:text-slate-400'>
            {stat.title}
          </div>
        </div>

        {/* Bottom colored progress accent bar */}
        <div className={`h-1 w-full rounded-full ${bgColor} overflow-hidden`}>
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: isVisible ? '100%' : '0%' }}
          />
        </div>

        <div className='pt-1'>
          <span className='inline-flex items-center text-xs font-bold text-blue-600 transition-colors duration-300 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
            View details
            <ChevronRightIcon className='ml-1 h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1' />
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    title: 'Dashboard',
    subtitle: 'Welcome back!',
    stats: [],
  });

  // New state for enhanced features
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsContext();
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userActivity, setUserActivity] = useState({
    lastActive: 'Just now',
    streak: 0,
    achievements: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [projectProgressData, setProjectProgressData] = useState([]);
  const [statsData, setStatsData] = useState({});

  // Reset scroll position to top whenever Dashboard is loaded or revisited via Back navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const handlePopState = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- Data Loading Logic ---
  const loadDashboardData = useCallback(async () => {
    try {
      if (!user) {
        setDashboardData({
          title: 'Dashboard',
          subtitle: 'Welcome back!',
          stats: [],
        });
        return;
      }

      // Set time-based greeting
      const hour = new Date().getHours();
      let timeGreeting = '';
      if (hour < 12) timeGreeting = 'Good Morning';
      else if (hour < 18) timeGreeting = 'Good Afternoon';
      else timeGreeting = 'Good Evening';

      setTimeOfDay(timeGreeting);

      // Personalized greeting based on time and role
      const greetings =
        user?.role === 'student'
          ? [
            'Welcome back! Track your project milestones, deadlines, assigned guide, and meeting schedules.',
            'Great to see you! Review your team project progress and upcoming deadlines.',
            'Ready to achieve your project goals today?',
          ]
          : user?.role === 'faculty'
            ? [
              'Welcome back! Review student proposals, manage assigned projects, and conduct sync meetings.',
              "Ready to evaluate today's project submissions and provide guidance?",
              'Great to have you back in the faculty workspace.',
            ]
            : [
              'Welcome to System Oversight. Manage operations, users, faculty guides, and project governance.',
              'Administrator Console ready. System status and analytics are up to date.',
              'Ready to optimize organizational project workflow?',
            ];
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

      // Fetch dashboard data
      const [statsResult] = await Promise.allSettled([
        user.role === 'admin'
          ? analyticsService.getDashboardStats()
          : user.role === 'faculty'
            ? analyticsService.getFacultyDashboardStats()
            : analyticsService.getStudentDashboardStats(),
      ]);

      const apiData =
        statsResult.status === 'fulfilled' ? statsResult.value : { data: {} };
      const statsData = apiData?.data || apiData || {};

      // Create role-specific dashboard data using the fresh statsData
      let data = null;
      const freshMeetings = statsData.todayMeetings || [];
      const freshDeadlines = statsData.upcomingDeadlines || [];

      switch (user.role) {
        case 'admin':
          data = {
            title: 'Administrator Dashboard',
            subtitle:
              'Manage system operations, user accounts, and project governance',
            stats: [
              {
                title: 'Total Projects',
                value: statsData.totalProjects || 0,
                icon: ChartBarIcon,
                color: 'orange',
                change: statsData.projectGrowth || '+0%',
                trend: 'up',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Active Students',
                value: statsData.activeStudents || statsData.totalStudents || 0,
                icon: UserGroupIcon,
                color: 'emerald',
                change: 'Active enrolled',
                trend: 'up',
                onClick: () => navigate('/students'),
              },
              {
                title: 'Total Faculty',
                value: statsData.activeFaculty || 0,
                icon: AcademicCapIcon,
                color: 'purple',
                change: 'Active guides',
                trend: 'info',
                onClick: () => navigate('/staff'),
              },
              {
                title: 'Upcoming Meetings',
                value: freshMeetings.length || 0,
                icon: CalendarIcon,
                color: 'rose',
                change:
                  freshMeetings.length > 0
                    ? `Next: ${freshMeetings[0].time}`
                    : 'No meetings today',
                trend: 'info',
                onClick: () => navigate('/meetings'),
              },
            ],
          };

          break;

        case 'faculty':
          data = {
            title: 'Faculty Dashboard',
            subtitle: 'Guide and evaluate assigned student projects',
            stats: [
              {
                title: 'Assigned Projects',
                value:
                  statsData.myProjects ||
                  statsData.assignedProjects ||
                  statsData.totalProjects ||
                  0,
                icon: ChartBarIcon,
                color: 'cyan',
                change: 'Under your guidance',
                trend: 'info',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Students Under Guidance',
                value: statsData.activeStudents || 0,
                icon: UserGroupIcon,
                color: 'emerald',
                change: 'Active group members',
                trend: 'info',
                onClick: () => navigate('/students'),
              },
              {
                title: 'Pending Reviews',
                value:
                  statsData.pendingReviews || statsData.pendingApprovals || 0,
                icon: ClipboardIcon,
                color: 'amber',
                change: 'Awaiting feedback',
                trend: 'attention',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Upcoming Meetings',
                value: freshMeetings.length || 0,
                icon: CalendarIcon,
                color: 'rose',
                change:
                  freshMeetings.length > 0
                    ? `Next: ${freshMeetings[0].time}`
                    : 'No meetings today',
                trend: 'info',
                onClick: () => navigate('/meetings'),
              },
            ],
          };

          break;

        case 'student': {
          const formattedStatus = statsData.projectStatus
            ? statsData.projectStatus
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())
            : 'Not Assigned';

          data = {
            title: 'Student Dashboard',
            subtitle:
              'Track your project status, deadlines, and team communications',
            stats: [
              {
                title: 'My Project',
                value: statsData.myProjects ?? 0,
                icon: ChartBarIcon,
                color: 'indigo',
                change:
                  statsData.myProjects > 0 ? 'Assigned' : 'No project yet',
                trend: statsData.myProjects > 0 ? 'up' : 'info',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Project Status',
                value: formattedStatus,
                icon: CheckCircleIcon,
                color: 'emerald',
                change: statsData.projectStatus
                  ? 'Active Project'
                  : 'Pending Allocation',
                trend: statsData.projectStatus ? 'up' : 'info',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'My Meetings',
                value: freshMeetings.length,
                icon: CalendarIcon,
                color: 'rose',
                change:
                  freshMeetings.length > 0
                    ? `Next: ${freshMeetings[0].time || 'today'}`
                    : 'None today',
                trend: 'info',
                onClick: () => navigate('/meetings'),
              },
              {
                title: 'My Milestones',
                value: statsData.myMilestones ?? 0,
                icon: FlagIcon,
                color: 'amber',
                change: 'Timeline milestones',
                trend: 'attention',
                onClick: () => navigate('/timeline'),
              },
            ],
          };

          break;
        }

        default:
          data = {
            title: 'Dashboard',
            subtitle: 'Welcome back!',
            stats: [],
          };
      }

      if (data && data.title) {
        setDashboardData(data);
        setUpcomingDeadlines(freshDeadlines);
        setTodayMeetings(freshMeetings);
        setPerformanceData(statsData.performanceData || []);
        setRecentActivities(statsData.recentActivities || []);
        setProjectProgressData(statsData.projectProgress || []);
        setStatsData(statsData);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      toast.error('Failed to load dashboard data');
      setDashboardData({
        title: 'Dashboard',
        subtitle: 'Welcome back!',
        stats: [],
      });
    }
  }, [user, navigate]);

  const location = useLocation();

  // Load dashboard data
  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;
    const loadData = async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);
      await loadDashboardData();
      if (isMounted && !isBackground) setIsLoading(false);
    };

    loadData(false);

    // 1. Re-fetch on event bus notification
    const unsubscribeBus = subscribeDataChanged(() => loadData(true));

    // 2. Re-fetch when window gains focus or visibility changes
    const handleFocus = () => loadData(true);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadData(true);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // 3. Polling interval every 15 seconds for real-time live updates
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData(true);
      }
    }, 15000);

    return () => {
      isMounted = false;
      unsubscribeBus();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(pollInterval);
    };
  }, [authLoading, user?.id]);

  const handleRefresh = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading('Refreshing dashboard...');
    try {
      await loadDashboardData();
      toast.success('Dashboard refreshed!', { id: loadingToast });
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to refresh dashboard', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification actions
  const handleNotificationClick = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Loading state with Skeleton Loader
  if (authLoading || isLoading) {
    return (
      <div className='space-y-6 pt-0 px-0 pb-6'>
        <DashboardSkeleton />
      </div>
    );
  }

  // --- Render ---
  return (
    <div className='animate-fade-in space-y-6 pt-0 px-0 pb-6'>
      {/* ================================================== */}
      {/* PREMIUM NATIVE MOBILE DASHBOARD VIEW (< 768px) */}
      {/* ================================================== */}
      <div className='block md:hidden space-y-4'>
        {/* 1. Premium Glassmorphic Welcome Card */}
        <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/20'>
          {/* Ambient Glow Graphic */}
          <div className='absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none' />

          <div className='relative z-10 space-y-3'>
            <div className='flex items-center gap-3'>
              {/* User Avatar Circle */}
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/30 shadow-xs'>
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  : 'BP'}
              </div>
              <div className='min-w-0 flex-1'>
                <h1 className='text-lg font-extrabold text-white leading-tight truncate'>
                  {timeOfDay},{' '}
                  <span className='underline decoration-sky-300 decoration-2 underline-offset-2'>
                    {user?.name || 'User'}
                  </span>
                </h1>
                <p className='text-xs text-blue-100/90 truncate font-medium'>
                  {greeting}
                </p>
              </div>
            </div>

            <div className='flex items-center justify-between pt-2 border-t border-white/15 text-xs font-semibold text-blue-100'>
              <span className='inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-xs font-bold text-white border border-white/25'>
                {user?.role === 'admin'
                  ? 'Administrator'
                  : user?.role === 'faculty'
                    ? 'Faculty'
                    : 'Student'}
              </span>
              <span className='inline-flex items-center gap-1.5 text-xs text-blue-100/90 font-medium'>
                <CalendarDaysIcon className='h-3.5 w-3.5 text-blue-200' />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Quick Actions Grid (2-Column Square Icon Cards) */}
        <div>
          <div className='flex items-center justify-between mb-2 px-1'>
            <h2 className='text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
              Quick Actions
            </h2>
            <span className='text-[10px] font-bold text-blue-600 dark:text-blue-400'>
              Tap to action
            </span>
          </div>
          <div className='grid grid-cols-2 gap-2.5'>
            {/* 1. Projects Card */}
            <div
              onClick={() => navigate('/projects')}
              className='group relative flex flex-col justify-between h-28 rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 p-3.5 shadow-2xs hover:shadow-md active:scale-95 transition-all cursor-pointer overflow-hidden'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform'>
                <FolderKanbanIcon className='h-5 w-5' />
              </div>
              <div>
                <h3 className='text-xs font-bold text-slate-900 dark:text-white line-clamp-1'>
                  Projects
                </h3>
                <p className='text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1'>
                  Manage & view all
                </p>
              </div>
            </div>

            {/* 2. Meetings Card */}
            <div
              onClick={() => navigate('/meetings')}
              className='group relative flex flex-col justify-between h-28 rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 p-3.5 shadow-2xs hover:shadow-md active:scale-95 transition-all cursor-pointer overflow-hidden'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform'>
                <ClockIcon className='h-5 w-5' />
              </div>
              <div>
                <h3 className='text-xs font-bold text-slate-900 dark:text-white line-clamp-1'>
                  Meetings
                </h3>
                <p className='text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1'>
                  Schedules & sync
                </p>
              </div>
            </div>

            {/* 3. Resources Card */}
            <div
              onClick={() => navigate('/resources')}
              className='group relative flex flex-col justify-between h-28 rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 p-3.5 shadow-2xs hover:shadow-md active:scale-95 transition-all cursor-pointer overflow-hidden'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform'>
                <BookOpenIcon className='h-5 w-5' />
              </div>
              <div>
                <h3 className='text-xs font-bold text-slate-900 dark:text-white line-clamp-1'>
                  Resources
                </h3>
                <p className='text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1'>
                  Assets & files
                </p>
              </div>
            </div>

            {/* 4. Admin Action / Milestones Card */}
            {user?.role === 'admin' ? (
              <div
                onClick={() => navigate('/project-types')}
                className='group relative flex flex-col justify-between h-28 rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 p-3.5 shadow-2xs hover:shadow-md active:scale-95 transition-all cursor-pointer overflow-hidden'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform'>
                  <PlusIcon className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='text-xs font-bold text-slate-900 dark:text-white line-clamp-1'>
                    New Project
                  </h3>
                  <p className='text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1'>
                    Create project type
                  </p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => navigate('/milestones')}
                className='group relative flex flex-col justify-between h-28 rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 p-3.5 shadow-2xs hover:shadow-md active:scale-95 transition-all cursor-pointer overflow-hidden'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform'>
                  <FlagIcon className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='text-xs font-bold text-slate-900 dark:text-white line-clamp-1'>
                    Milestones
                  </h3>
                  <p className='text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1'>
                    Track progress
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Overview Statistics Grid (2-Column) */}
        {dashboardData.stats.length > 0 && (
          <div>
            <div className='flex items-center justify-between mb-2 px-1'>
              <h2 className='text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                Overview Statistics
              </h2>
              <span className='text-[10px] font-bold text-blue-600 dark:text-blue-400'>
                Live metrics
              </span>
            </div>
            <div className='grid grid-cols-2 gap-2.5'>
              {dashboardData.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    onClick={stat.onClick}
                    className='rounded-2xl border border-slate-100 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 cursor-pointer active:scale-95 transition-all space-y-2'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400'>
                        <Icon className='h-4 w-4' />
                      </div>
                      <span className='text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full'>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <div className='text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums'>
                        {stat.value}
                      </div>
                      <div className='text-xs font-bold text-slate-600 dark:text-slate-400 truncate mt-0.5'>
                        {stat.title}
                      </div>
                    </div>
                    <div className='h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
                      <div className='h-full bg-blue-600 dark:bg-blue-400 rounded-full w-full' />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Upcoming Deadlines & Schedule Timeline */}
        {upcomingDeadlines.length > 0 && (
          <div>
            <div className='flex items-center justify-between mb-2 px-1'>
              <h2 className='text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                Upcoming Deadlines
              </h2>
              <button
                onClick={() => navigate('/meetings')}
                className='text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5'
              >
                View Calendar <ChevronRightIcon className='h-3 w-3' />
              </button>
            </div>
            <div className='space-y-2'>
              {upcomingDeadlines.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'>
                      <CalendarDaysIcon className='h-4 w-4' />
                    </div>
                    <div className='min-w-0'>
                      <h4 className='text-xs font-bold text-slate-900 dark:text-white truncate'>
                        {item.title}
                      </h4>
                      <p className='text-[11px] font-medium text-slate-500 dark:text-slate-400'>
                        Due {item.due} at {item.time}
                      </p>
                    </div>
                  </div>
                  <span className='shrink-0 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full'>
                    {item.priority || 'Normal'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* DESKTOP & TABLET DASHBOARD VIEW (>= 768px / Preserved Unchanged) */}
      {/* ================================================== */}
      <div className='hidden md:block space-y-6'>
        {/* Top Greeting Heading (Outside Card) */}
        <div className='mb-2 sm:mb-4'>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl'>
            {timeOfDay},{' '}
            <span className='text-blue-600 font-bold dark:text-blue-400'>
              {user?.name || 'Bhaviik Parmar'}
            </span>
          </h1>
          <p className='mt-1 text-sm font-medium text-slate-600 dark:text-slate-400'>
            {greeting}
          </p>
        </div>

        {/* Welcome Card - Soft white card with rounded-3xl matching reference mockup */}
        <div className='rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 md:p-8 space-y-4'>
          {/* Left Icon Box */}
          <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-blue-500 text-white shadow-md'>
            <HomeIcon className='h-7 w-7 text-white' />
          </div>

          {/* Badge & Date Row */}
          <div className='flex items-center gap-2.5 flex-wrap'>
            <span className='inline-flex items-center rounded-full bg-blue-100/90 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'>
              {user?.role === 'admin'
                ? 'Administrator'
                : user?.role === 'faculty'
                  ? 'Faculty'
                  : 'Student'}
            </span>
            <span className='inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400'>
              <CalendarDaysIcon className='h-4 w-4 text-slate-400' />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Action Buttons: Stacked rounded-2xl buttons matching mockup */}
          <div className='flex flex-col sm:flex-row flex-wrap gap-2.5 pt-1'>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className='inline-flex items-center justify-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all active:scale-[0.98]'
            >
              {isLoading ? (
                <RefreshIcon className='h-4 w-4 animate-spin text-slate-600 dark:text-slate-400' />
              ) : (
                <RefreshIcon className='h-4 w-4 text-slate-600 dark:text-slate-400' />
              )}
              <span>{isLoading ? 'Refreshing…' : 'Refresh Dashboard'}</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/project-types')}
                className='inline-flex items-center justify-start gap-2.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all active:scale-[0.98]'
              >
                <PlusIcon className='h-4 w-4' />
                <span>New Project Type</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  try {
                    exportDashboardToCSV(dashboardData, user?.role || 'user');
                    toast.success('Report generated successfully!');
                  } catch (error) {
                    console.error('Export failed:', error);
                    toast.error('Failed to generate report');
                  }
                }}
                className='inline-flex items-center justify-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all active:scale-[0.98]'
              >
                <DownloadIcon className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                <span>Export Report</span>
              </button>
            )}

            {user?.role === 'faculty' && (
              <>
                <button
                  onClick={() => navigate('/meetings')}
                  className='inline-flex items-center justify-start gap-2.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all active:scale-[0.98]'
                >
                  <ClockIcon className='h-4 w-4' />
                  <span>My Meetings</span>
                </button>
                <button
                  onClick={() => navigate('/resources')}
                  className='inline-flex items-center justify-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all active:scale-[0.98]'
                >
                  <BookOpenIcon className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                  <span>Resource Library</span>
                </button>
              </>
            )}

            {user?.role === 'student' && (
              <>
                <button
                  onClick={() => navigate('/meetings')}
                  className='inline-flex items-center justify-start gap-2.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all active:scale-[0.98]'
                >
                  <ClockIcon className='h-4 w-4' />
                  <span>My Meetings</span>
                </button>
                <button
                  onClick={() => navigate('/resources')}
                  className='inline-flex items-center justify-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all active:scale-[0.98]'
                >
                  <BookOpenIcon className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                  <span>Resource Library</span>
                </button>
                <button
                  onClick={() => navigate('/milestones')}
                  className='inline-flex items-center justify-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all active:scale-[0.98]'
                >
                  <FlagIcon className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                  <span>My Milestones</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid - Role Specific with Animations */}
        {dashboardData.stats.length > 0 && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {dashboardData.stats.map((stat, index) => (
              <AnimatedStatCard
                key={index}
                stat={stat}
                index={index}
                onClick={stat.onClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left Column - 2/3 width */}
        <div className='flex flex-col space-y-8 lg:col-span-2'>
          <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <RecentActivity
              activities={recentActivities}
              userRole={user?.role}
            />
          </div>

          {/* Upcoming Deadlines */}
          <div className='flex-1 flex flex-col rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 sm:h-10 sm:w-10'>
                  <CalendarDaysIcon className='h-4 w-4 text-orange-600 dark:text-orange-400 sm:h-5 sm:w-5' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Upcoming Deadlines
                  </h3>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    Stay on track with your tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/meetings')}
                className='group flex items-center rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300'
              >
                View Calendar
                <ChevronRightIcon className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
              </button>
            </div>

            <div className='flex-1 flex flex-col space-y-4'>
              {upcomingDeadlines.length === 0 ? (
                <div className='flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-center dark:border-slate-700/50 dark:bg-slate-800/30'>
                  <div className='mb-4 rounded-full bg-slate-100 p-3 sm:p-4 dark:bg-slate-800'>
                    <CalendarDaysIcon className='h-6 w-6 text-slate-400 dark:text-slate-500 sm:h-8 sm:w-8' />
                  </div>
                  <h4 className='text-base font-semibold text-slate-700 dark:text-slate-300'>
                    No Upcoming Deadlines
                  </h4>
                  <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                    You're all caught up on your tasks!
                  </p>
                </div>
              ) : (
                upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`group flex items-center justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${deadline.priority === 'high'
                      ? 'border-red-100 bg-gradient-to-r from-red-50 to-white dark:border-red-900/30 dark:from-red-900/10 dark:to-slate-800/80 hover:border-red-200'
                      : 'border-slate-100 bg-white dark:border-slate-700/50 dark:bg-slate-800/80 hover:border-blue-100 hover:bg-blue-50/50 dark:hover:border-blue-900/30 dark:hover:bg-slate-800'
                      }`}
                  >
                    <div className='flex items-center gap-5'>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 sm:h-12 sm:w-12 ${deadline.priority === 'high'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-400'
                          }`}
                      >
                        <CalendarDaysIcon className='h-5 w-5 sm:h-6 sm:w-6' />
                      </div>
                      <div className='flex flex-col justify-center'>
                        <h4 className='text-base font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                          {deadline.title}
                        </h4>
                        <div className='mt-1.5 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                          <span className='flex items-center gap-1.5'>
                            <ClockIcon className='h-4 w-4' />
                            {deadline.time || '05:00 PM'}
                          </span>
                          <span className='flex items-center gap-1.5'>
                            <CalendarDaysIcon className='h-4 w-4' />
                            {deadline.due ||
                              (deadline.date
                                ? new Date(deadline.date).toLocaleDateString(
                                  undefined,
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }
                                )
                                : 'Upcoming')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='ml-4 shrink-0'>
                      <span
                        className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase shadow-sm ${deadline.priority === 'high'
                          ? 'border border-red-200 bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:border-red-800 dark:from-red-900/50 dark:to-red-800/30 dark:text-red-300'
                          : 'border border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 dark:border-slate-700 dark:from-slate-800 dark:to-slate-700/50 dark:text-slate-300'
                          }`}
                      >
                        {deadline.priority === 'high' ? 'URGENT' : 'UPCOMING'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className='flex flex-col space-y-8 h-full'>
          {/* Notification Center */}
          <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 sm:h-10 sm:w-10'>
                  <BellIcon className='h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Notifications
                  </h3>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    {notifications.filter((n) => !n.read).length} unread
                  </p>
                </div>
              </div>
              <button
                onClick={markAllNotificationsAsRead}
                className='group rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300'
              >
                Mark all read
              </button>
            </div>

            <div className='max-h-96 space-y-4 overflow-y-auto pr-2'>
              {notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-700'>
                  <BellIcon className='mb-3 h-8 w-8 text-slate-300 dark:text-slate-600 sm:h-10 sm:w-10' />
                  <p className='text-sm font-semibold text-slate-600 dark:text-slate-300'>
                    No new notifications.
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                    You're all caught up!
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id || notification.id}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:shadow-sm ${notification.read
                      ? 'border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-700 dark:bg-slate-800'
                      : 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:border-blue-800 dark:from-blue-900/30 dark:to-blue-800/20'
                      }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification._id || notification.id
                      )
                    }
                  >
                    <div className='flex items-start justify-between group/notif'>
                      <div
                        className='flex-1 pr-4'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(
                            notification._id || notification.id
                          );
                        }}
                      >
                        <div className='mb-2 flex items-center'>
                          <span
                            className={`mr-2 h-2 w-2 rounded-full ${notification.read
                              ? 'bg-gray-300 dark:bg-gray-600'
                              : 'bg-blue-500'
                              }`}
                          ></span>
                          <span className='rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 dark:bg-slate-700 dark:text-gray-300'>
                            {notification.type?.toUpperCase()}
                          </span>
                          <span className='ml-2 text-xs text-gray-500 dark:text-gray-400'>
                            {notification.time ||
                              (notification.createdAt
                                ? timeAgo(notification.createdAt)
                                : 'Just now')}
                          </span>
                        </div>
                        <p
                          className={`font-medium ${notification.read
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-900 dark:text-white'
                            }`}
                        >
                          {notification.message}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(
                            notification._id || notification.id
                          );
                        }}
                        className='text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover/notif:opacity-100 dark:text-gray-500 dark:hover:text-red-400'
                        title='Delete notification'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Meetings */}
          <div className='rounded-2xl border border-gray-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
            <UpcomingMeetings
              meetings={todayMeetings}
              userRole={user?.role}
              title="Today's Meetings"
              emptyMessage='No meetings scheduled for today.'
            />
          </div>

          {/* Quick Resources */}
          <div className='flex-1 flex flex-col justify-between rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 sm:h-10 sm:w-10'>
                  <BookOpenIcon className='h-4 w-4 text-green-600 dark:text-green-400 sm:h-5 sm:w-5' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Quick Access
                  </h3>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    Frequently used resources
                  </p>
                </div>
              </div>
              <CheckCircleIcon className='h-5 w-5 text-green-500 dark:text-green-400' />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {[
                {
                  icon: DocumentTextIcon,
                  label: 'Resource Library',
                  color: 'blue',
                  path: '/resources',
                },
                {
                  icon: CalendarDaysIcon,
                  label: 'My Schedule',
                  color: 'purple',
                  path: '/meetings/calendar',
                },
                {
                  icon:
                    user?.role === 'student'
                      ? FlagIcon
                      : user?.role === 'faculty'
                        ? ClockIcon
                        : ChartBarSquareIcon,
                  label:
                    user?.role === 'student'
                      ? 'Milestones'
                      : user?.role === 'faculty'
                        ? 'My Meetings'
                        : 'Grades',
                  color: 'green',
                  path:
                    user?.role === 'student'
                      ? '/milestones'
                      : user?.role === 'faculty'
                        ? '/meetings'
                        : '/analytics/grades',
                },
                {
                  icon: AdjustmentsIcon,
                  label: 'Settings',
                  color: 'gray',
                  path:
                    user?.role === 'admin'
                      ? '/system-settings'
                      : '/profile-settings',
                },
              ].map((resource, index) => {
                const bgColorClass =
                  resource.color === 'blue'
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : resource.color === 'purple'
                      ? 'bg-purple-50 dark:bg-purple-900/20'
                      : resource.color === 'green'
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-gray-50 dark:bg-slate-700/30';
                const iconColorClass =
                  resource.color === 'blue'
                    ? 'text-blue-600 dark:text-blue-400'
                    : resource.color === 'purple'
                      ? 'text-purple-600 dark:text-purple-400'
                      : resource.color === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400';

                return (
                  <button
                    key={index}
                    onClick={() => navigate(resource.path)}
                    className='group relative overflow-hidden rounded-xl border border-gray-200 p-5 text-center transition-all duration-300 hover:border-transparent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:hover:shadow-slate-700/30 dark:focus:ring-offset-slate-800'
                    aria-label={resource.label}
                  >
                    <div
                      className={`absolute inset-0 ${bgColorClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <div className='relative z-10'>
                      <div
                        className={`${iconColorClass} mb-3 flex transform justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-125`}
                      >
                        <resource.icon className='h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7' aria-hidden='true' />
                      </div>
                      <div className='font-semibold text-gray-900 dark:text-white transition-colors '>
                        {resource.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Project Progress */}
        <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
          <div className='mb-8 flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20 sm:h-10 sm:w-10'>
                <ChartBarIcon className='h-4 w-4 text-indigo-600 dark:text-indigo-400 sm:h-5 sm:w-5' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Project Progress
                </h3>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                  Track project completion
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className='group flex items-center rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300'
            >
              View all
              <ChevronRightIcon className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
            </button>
          </div>

          <ProgressVisualization
            projects={projectProgressData}
            userRole={user?.role}
          />
        </div>

        {/* System Metrics – Admin/Faculty only */}
        {user?.role !== 'student' && <SystemMetrics stats={statsData} />}
      </div>

      {/* Role-specific Content */}
      {user?.role === 'admin' && (
        <div className='rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100/50 p-6 shadow-sm dark:border-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/20'>
          <div className='flex flex-col justify-between gap-6 md:flex-row md:items-start'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <InformationCircleIcon className='h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400 sm:h-6 sm:w-6' />
              </div>
              <div className='ml-4'>
                <h4 className='mb-3 text-lg font-bold text-yellow-800 dark:text-yellow-200'>
                  Administrator Alerts
                </h4>
                <div className='space-y-2 text-sm text-yellow-700 dark:text-yellow-300'>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 3).map((notif, idx) => (
                      <p key={idx} className='flex items-center'>
                        <span className='mr-2 h-1.5 w-1.5 rounded-full bg-yellow-500'></span>
                        {notif.message}
                      </p>
                    ))
                  ) : (
                    <p className='flex items-center'>
                      <span className='mr-2 h-1.5 w-1.5 rounded-full bg-yellow-500'></span>
                      No urgent alerts at this time.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className='whitespace-nowrap rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 px-5 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:from-yellow-700 hover:to-yellow-600 hover:shadow-lg'
            >
              Manage Alerts
            </button>
          </div>
        </div>
      )}

      {user?.role === 'student' && (
        <div className='rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 p-6 shadow-sm dark:border-blue-800 dark:from-blue-900/30 dark:to-blue-800/20'>
          <div className='flex flex-col justify-between gap-6 md:flex-row md:items-start'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <LightBulbIcon className='h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6' />
              </div>
              <div className='ml-4'>
                <h4 className='mb-3 text-lg font-bold text-blue-800 dark:text-blue-200'>
                  Study Tip of the Day
                </h4>
                <p className='text-blue-700 dark:text-blue-300'>
                  Break your study sessions into 25-minute focused intervals
                  with 5-minute breaks (Pomodoro Technique). This improves
                  retention and prevents burnout.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/resources')}
              className='whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg'
            >
              More Tips
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
