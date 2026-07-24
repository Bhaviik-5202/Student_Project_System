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

  const bgColor =
    stat.color === 'blue'
      ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20'
      : stat.color === 'green'
        ? 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20'
        : stat.color === 'yellow'
          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20'
          : 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20';
  const iconColor =
    stat.color === 'blue'
      ? 'text-blue-600 dark:text-blue-400'
      : stat.color === 'green'
        ? 'text-green-600 dark:text-green-400'
        : stat.color === 'yellow'
          ? 'text-yellow-600 dark:text-yellow-400'
          : 'text-purple-600 dark:text-purple-400';
  const borderColor =
    stat.color === 'blue'
      ? 'border-blue-100 dark:border-blue-800'
      : stat.color === 'green'
        ? 'border-green-100 dark:border-green-800'
        : stat.color === 'yellow'
          ? 'border-yellow-100 dark:border-yellow-800'
          : 'border-purple-100 dark:border-purple-800';
  const progressColor =
    stat.color === 'blue'
      ? 'bg-blue-500 dark:bg-blue-400'
      : stat.color === 'green'
        ? 'bg-green-500 dark:bg-green-400'
        : stat.color === 'yellow'
          ? 'bg-yellow-500 dark:bg-yellow-400'
          : 'bg-purple-500 dark:bg-purple-400';

  return (
    <div
      className={`group relative rounded-2xl border bg-white dark:bg-slate-800 ${borderColor} cursor-pointer overflow-hidden p-6 transition-all duration-300 ${isVisible
        ? 'translate-y-0 opacity-100 hover:border-transparent hover:shadow-lg dark:hover:shadow-slate-700/30'
        : 'translate-y-4 opacity-0'
        }`}
      onClick={onClick}
    >
      {/* Background overlay - same as Quick Access */}
      <div
        className={`absolute inset-0 ${bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className='relative z-10'>
        <div className='mb-6 flex items-center justify-between'>
          <div
            className={`h-14 w-14 ${bgColor} flex items-center justify-center rounded-xl border ${borderColor}`}
          >
            <Icon
              className={`h-7 w-7 ${iconColor} transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-125`}
            />
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${stat.trend === 'up'
              ? 'border border-green-200 bg-gradient-to-r from-green-100 to-green-50 text-green-700 dark:border-green-800 dark:from-green-900/40 dark:to-green-800/30 dark:text-green-400'
              : stat.trend === 'attention'
                ? 'border border-yellow-200 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 dark:border-yellow-800 dark:from-yellow-900/40 dark:to-yellow-800/30 dark:text-yellow-400'
                : 'border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:border-blue-800 dark:from-blue-900/40 dark:to-blue-800/30 dark:text-blue-400'
              }`}
          >
            {stat.change}
          </span>
        </div>
        <div className='mb-2 text-3xl font-bold tabular-nums text-gray-900 dark:text-white'>
          {animatedValue}
          {suffix}
        </div>
        <div className='text-lg font-medium text-gray-600 dark:text-gray-400'>
          {stat.title}
        </div>
        {/* Progress bar animation */}
        <div className={`mt-4 h-1 rounded-full ${bgColor} overflow-hidden`}>
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: isVisible ? '100%' : '0%' }}
          />
        </div>
        <div className='mt-4 border-t border-gray-100 pt-4 dark:border-slate-700'>
          <span className='flex items-center text-sm font-medium text-blue-600 transition-colors duration-300 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
            View details
            <ChevronRightIcon className='ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1' />
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
  const [notifications, setNotifications] = useState([]);
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

      // Fetch dashboard data and notifications concurrently from API
      const [statsResult, notifResult] = await Promise.allSettled([
        user.role === 'admin'
          ? analyticsService.getDashboardStats()
          : user.role === 'faculty'
            ? analyticsService.getFacultyDashboardStats()
            : analyticsService.getStudentDashboardStats(),
        api.get('/notifications'),
      ]);

      const apiData = statsResult.status === 'fulfilled' ? statsResult.value : { data: {} };
      const statsData = apiData?.data || apiData || {};

      let apiNotifications = [];
      if (notifResult.status === 'fulfilled') {
        const rawNotifs = notifResult.value;
        apiNotifications = rawNotifs?.data || rawNotifs || [];
      }

      const mappedNotifications = (
        statsData.notifications ||
        apiNotifications ||
        []
      ).map((n) => ({
        id: n._id || n.id,
        type: n.type || 'info',
        read: n.read || false,
        message: n.message || '',
        time: n.createdAt ? timeAgo(n.createdAt) : n.time || 'Just now',
      }));

      // Create role-specific dashboard data using the fresh statsData
      let data = null;
      const freshMeetings = statsData.todayMeetings || [];
      const freshDeadlines = statsData.upcomingDeadlines || [];

      switch (user.role) {
        case 'admin':
          data = {
            title: 'Administrator Dashboard',
            subtitle: 'Manage system operations, user accounts, and project governance',
            stats: [
              {
                title: 'Total Projects',
                value: statsData.totalProjects || 0,
                icon: ChartBarIcon,
                color: 'blue',
                change: statsData.projectGrowth || '+0%',
                trend: 'up',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Active Students',
                value: statsData.activeStudents || statsData.totalStudents || 0,
                icon: UserGroupIcon,
                color: 'green',
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
                color: 'emerald',
                change: freshMeetings.length > 0 ? `Next: ${freshMeetings[0].time}` : 'No meetings today',
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
                value: statsData.myProjects || statsData.assignedProjects || statsData.totalProjects || 0,
                icon: ChartBarIcon,
                color: 'blue',
                change: 'Under your guidance',
                trend: 'info',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Students Under Guidance',
                value: statsData.activeStudents || 0,
                icon: UserGroupIcon,
                color: 'green',
                change: 'Active group members',
                trend: 'info',
                onClick: () => navigate('/students'),
              },
              {
                title: 'Pending Reviews',
                value: statsData.pendingReviews || statsData.pendingApprovals || 0,
                icon: ClipboardIcon,
                color: 'yellow',
                change: 'Awaiting feedback',
                trend: 'attention',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Upcoming Meetings',
                value: freshMeetings.length || 0,
                icon: CalendarIcon,
                color: 'purple',
                change: freshMeetings.length > 0 ? `Next: ${freshMeetings[0].time}` : 'No meetings today',
                trend: 'info',
                onClick: () => navigate('/meetings'),
              },
            ],
          };

          break;

        case 'student':
          data = {
            title: 'Student Dashboard',
            subtitle: 'Track your project status, deadlines, and team communications',
            stats: [
              {
                title: 'My Project',
                value: statsData.myProjects || 1,
                icon: ChartBarIcon,
                color: 'blue',
                change: statsData.projectStatus || 'In Progress',
                trend: 'info',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Project Status',
                value: statsData.projectStatus || 'Active',
                icon: CheckCircleIcon,
                color: 'green',
                change: 'On Schedule',
                trend: 'up',
                onClick: () => navigate('/projects'),
              },
              {
                title: 'Upcoming Meetings',
                value: freshMeetings.length || 0,
                icon: CalendarIcon,
                color: 'purple',
                change: freshMeetings.length > 0 ? `Next: ${freshMeetings[0].time}` : 'None today',
                trend: 'info',
                onClick: () => navigate('/meetings'),
              },
              {
                title: 'Deadlines',
                value: freshDeadlines.length || 0,
                icon: ClipboardListIcon,
                color: 'yellow',
                change: 'Upcoming milestones',
                trend: 'attention',
                onClick: () => navigate('/projects'),
              },
            ],
          };

          break;

        default:
          data = {
            title: 'Dashboard',
            subtitle: 'Welcome back!',
            stats: [],
          };
      }

      if (data && data.title) {
        setDashboardData(data);
        setNotifications(mappedNotifications);
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
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(
        notifications.map((notif) => ({ ...notif, read: true }))
      );
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
      {/* Dashboard Header with Welcome - Enhanced with animations */}
      <div className='rounded-2xl border border-gray-200 bg-white dark:bg-slate-900 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 md:p-8'>
        <div className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center'>
          <div className='flex-1'>
            <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
              <div className='flex items-center gap-4'>
                <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md'>
                  <HomeIcon className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-3xl'>
                    {timeOfDay},{' '}
                    <span className='text-blue-600 dark:text-blue-400'>
                      {user?.name || 'Student'}
                    </span>
                  </h1>
                  <p className='mt-1 text-lg text-gray-600 dark:text-gray-400'>
                    {greeting}
                  </p>
                  <div className='mt-3 flex items-center gap-3'>
                    <span className='inline-flex items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-700 dark:from-blue-900/40 dark:to-blue-800/30 dark:text-blue-300'>
                      {user?.role === 'admin'
                        ? 'Administrator'
                        : user?.role === 'faculty'
                          ? 'Faculty'
                          : 'Student'}
                    </span>
                    <span className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                      <CalendarDaysIcon className='mr-1 h-4 w-4' />
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons with enhanced animations */}
            <div className='mt-8 flex flex-wrap gap-4'>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className='group relative inline-flex items-center overflow-hidden rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 hover:border-transparent hover:shadow-lg disabled:opacity-50 dark:border-slate-600 dark:text-gray-300'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700 dark:to-slate-600' />
                <div className='relative z-10 flex items-center'>
                  {isLoading ? (
                    <RefreshIcon className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <RefreshIcon className='mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180' />
                  )}
                  <span>
                    {isLoading ? 'Refreshing...' : 'Refresh Dashboard'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (user?.role === 'admin') navigate('/project-types');
                  else navigate('/projects/new');
                }}
                className='group relative inline-flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-xl'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                <div className='relative z-10 flex items-center'>
                  <PlusIcon className='mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-125' />
                  <span>
                    {user?.role === 'admin' && 'New Project Type'}
                    {user?.role === 'faculty' && 'New Project'}
                    {user?.role === 'student' && 'Submit Proposal'}
                  </span>
                </div>
              </button>

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
                className='group relative inline-flex items-center overflow-hidden rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 hover:border-transparent hover:shadow-lg dark:border-slate-600 dark:text-gray-300'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700 dark:to-slate-600' />
                <div className='relative z-10 flex items-center'>
                  <DownloadIcon className='mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:scale-110' />
                  <span>Export Report</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alert Section */}
      {(upcomingDeadlines?.filter((d) => d.priority === 'high')?.length || 0) >
        0 && (
          <div className='rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 p-6 shadow-sm dark:border-red-800 dark:from-red-900/30 dark:to-red-800/20'>
            <div className='flex flex-col md:flex-row md:items-center'>
              <div className='flex items-start md:items-center'>
                <div className='flex-shrink-0'>
                  <ExclamationTriangleIcon className='h-6 w-6 text-red-600 dark:text-red-400' />
                </div>
                <div className='ml-4 flex-1'>
                  <h3 className='mb-1 text-lg font-bold text-gray-900 dark:text-white'>
                    ⚠️ Urgent Action Required
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    {
                      upcomingDeadlines?.filter((d) => d.priority === 'high')[0]
                        ?.title
                    }{' '}
                    due{' '}
                    <span className='font-semibold'>
                      {
                        upcomingDeadlines?.filter((d) => d.priority === 'high')[0]
                          ?.due
                      }
                    </span>{' '}
                    at{' '}
                    <span className='font-semibold'>
                      {
                        upcomingDeadlines?.filter((d) => d.priority === 'high')[0]
                          ?.time
                      }
                    </span>
                  </p>
                </div>
              </div>
              <div className='mt-4 flex gap-3 md:ml-6 md:mt-0'>
                <button
                  onClick={() => navigate('/assignments')}
                  className='group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-xl'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  <span className='relative z-10 inline-block transition-transform duration-300 group-hover:scale-105'>
                    Start Now
                  </span>
                </button>
                <button
                  onClick={() => toast.info('Extension requested')}
                  className='group relative overflow-hidden rounded-xl border border-red-300 px-5 py-2.5 font-medium text-red-700 transition-all duration-300 hover:border-transparent hover:shadow-lg dark:border-red-700 dark:text-red-400'
                >
                  <div className='absolute inset-0 bg-red-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-red-900/30' />
                  <span className='relative z-10'>Request Extension</span>
                </button>
              </div>
            </div>
          </div>
        )}

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

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left Column - 2/3 width */}
        <div className='space-y-8 lg:col-span-2'>
          <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <RecentActivity
              activities={recentActivities}
              userRole={user?.role}
            />
          </div>

          {/* Upcoming Deadlines */}
          <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20'>
                  <CalendarDaysIcon className='h-5 w-5 text-orange-600 dark:text-orange-400' />
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

            <div className='space-y-4'>
              {upcomingDeadlines.length === 0 ? (
                <div className='rounded-xl border border-dashed border-slate-200 py-8 text-center text-slate-500 dark:text-slate-400 dark:border-slate-700 '>
                  No upcoming deadlines found.
                </div>
              ) : (
                upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`flex items-center justify-between rounded-xl border p-5 transition-all duration-300 hover:shadow-md ${deadline.priority === 'high'
                      ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 dark:border-red-800 dark:from-red-900/30 dark:to-red-800/20'
                      : 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:border-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/20'
                      }`}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`mr-4 h-3 w-3 rounded-full ${deadline.priority === 'high'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                          }`}
                      ></div>
                      <div>
                        <div className='font-bold text-gray-900 dark:text-white'>
                          {deadline.title}
                        </div>
                        <div className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                          <ClockIcon className='mr-1 inline h-3 w-3' />
                          Due {deadline.due} • {deadline.time}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-bold ${deadline.priority === 'high'
                        ? 'border border-red-200 bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:border-red-800 dark:from-red-900/40 dark:to-red-800/30 dark:text-red-400'
                        : 'border border-yellow-200 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 dark:border-yellow-800 dark:from-yellow-900/40 dark:to-yellow-800/30 dark:text-yellow-400'
                        }`}
                    >
                      {deadline.priority === 'high' ? 'URGENT' : 'UPCOMING'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className='space-y-8'>
          {/* Notification Center */}
          <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20'>
                  <BellIcon className='h-5 w-5 text-blue-600 dark:text-blue-400' />
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
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:shadow-sm ${notification.read
                    ? 'border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-700 dark:bg-slate-800'
                    : 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:border-blue-800 dark:from-blue-900/30 dark:to-blue-800/20'
                    }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center'>
                        <span
                          className={`mr-2 h-2 w-2 rounded-full ${notification.read
                            ? 'bg-gray-300 dark:bg-gray-600'
                            : 'bg-blue-500'
                            }`}
                        ></span>
                        <span className='rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 dark:bg-slate-700 dark:text-gray-300'>
                          {notification.type.toUpperCase()}
                        </span>
                        <span className='ml-2 text-xs text-gray-500 dark:text-gray-400'>
                          {notification.time}
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Meetings */}
          {todayMeetings.length > 0 && (
            <div className='rounded-2xl border border-gray-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
              <UpcomingMeetings
                meetings={todayMeetings}
                userRole={user?.role}
              />
            </div>
          )}

          {/* Quick Resources */}
          <div className='rounded-2xl border border-gray-100 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20'>
                  <BookOpenIcon className='h-5 w-5 text-green-600 dark:text-green-400' />
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

            <div className='grid grid-cols-2 gap-4'>
              {[
                {
                  icon: DocumentTextIcon,
                  label: 'Materials',
                  color: 'blue',
                  path: '/resources',
                },
                {
                  icon: CalendarDaysIcon,
                  label: 'Calendar',
                  color: 'purple',
                  path: '/meetings/calendar',
                },
                {
                  icon: ChartBarSquareIcon,
                  label: 'Grades',
                  color: 'green',
                  path: '/analytics/grades',
                },
                {
                  icon: AdjustmentsIcon,
                  label: 'Settings',
                  color: 'gray',
                  path: '/settings',
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
                        <resource.icon className='h-7 w-7' aria-hidden='true' />
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
              <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20'>
                <ChartBarIcon className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />
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

        {/* System Metrics */}
        <SystemMetrics stats={statsData} />
      </div>

      {/* Role-specific Content */}
      {user?.role === 'admin' && (
        <div className='rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100/50 p-6 shadow-sm dark:border-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/20'>
          <div className='flex flex-col justify-between gap-6 md:flex-row md:items-start'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <InformationCircleIcon className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
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
                <LightBulbIcon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
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
