/**
 * Dashboard Component
 * 
 * The main landing page for authenticated users (Admin, Faculty, Student).
 * Displays role-specific statistics, recent activity, upcoming meetings, 
 * and performance visualizations. Uses animated counters and premium 
 * tailwind styling for a high-quality user experience.
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Fragment } from "react";
import RecentActivity from "./RecentActivity";
import UpcomingMeetings from "./UpcomingMeetings";
import ProgressVisualization from "./ProgressVisualization";
import analyticsService from "../../../services/analyticsService";
import { exportDashboardToCSV } from "../../../utils/exportUtils";

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
} from "lucide-react";

import { Menu, Transition } from "@headlessui/react";

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
  const suffix = stat.value ? stat.value.toString().replace(/[0-9]/g, "") : "";
  const animatedValue = useAnimatedCounter(isVisible ? numericPart : 0, 1200);
  const Icon = stat.icon;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const bgColor =
    stat.color === "blue"
      ? "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20"
      : stat.color === "green"
        ? "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20"
        : stat.color === "yellow"
          ? "bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20"
          : "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20";
  const iconColor =
    stat.color === "blue"
      ? "text-blue-600 dark:text-blue-400"
      : stat.color === "green"
        ? "text-green-600 dark:text-green-400"
        : stat.color === "yellow"
          ? "text-yellow-600 dark:text-yellow-400"
          : "text-purple-600 dark:text-purple-400";
  const borderColor =
    stat.color === "blue"
      ? "border-blue-100 dark:border-blue-800"
      : stat.color === "green"
        ? "border-green-100 dark:border-green-800"
        : stat.color === "yellow"
          ? "border-yellow-100 dark:border-yellow-800"
          : "border-purple-100 dark:border-purple-800";
  const progressColor =
    stat.color === "blue"
      ? "bg-blue-500 dark:bg-blue-400"
      : stat.color === "green"
        ? "bg-green-500 dark:bg-green-400"
        : stat.color === "yellow"
          ? "bg-yellow-500 dark:bg-yellow-400"
          : "bg-purple-500 dark:bg-purple-400";

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800 rounded-2xl border ${borderColor} p-6 transition-all duration-300 cursor-pointer overflow-hidden ${
        isVisible
          ? "translate-y-0 opacity-100 hover:border-transparent hover:shadow-lg dark:hover:shadow-slate-700/30"
          : "translate-y-4 opacity-0"
      }`}
      onClick={onClick}
    >
      {/* Background overlay - same as Quick Access */}
      <div
        className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center border ${borderColor}`}
          >
            <Icon
              className={`w-7 h-7 ${iconColor} transform transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1`}
            />
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              stat.trend === "up"
                ? "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                : stat.trend === "attention"
                  ? "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                  : "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {stat.change}
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tabular-nums">
          {numericPart > 0 ? animatedValue : ""}
          {suffix}
        </div>
        <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          {stat.title}
        </div>
        {/* Progress bar animation */}
        <div className={`h-1 mt-4 rounded-full ${bgColor} overflow-hidden`}>
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: isVisible ? "100%" : "0%" }}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <span className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 font-medium flex items-center">
            View details
            <ChevronRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
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
    title: "Dashboard",
    subtitle: "Welcome back!",
    stats: [],
  });

  // New state for enhanced features
  const [notifications, setNotifications] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [greeting, setGreeting] = useState("");
  const [userActivity, setUserActivity] = useState({
    lastActive: "Just now",
    streak: 0,
    achievements: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [projectProgressData, setProjectProgressData] = useState([]);
  const [statsData, setStatsData] = useState({});

  // --- Data Loading Logic ---
  // Memoize the loadDashboardData function
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!user) {
        setDashboardData({
          title: "Dashboard",
          subtitle: "Welcome back!",
          stats: [],
        });
        return;
      }

      // Set time-based greeting
      const hour = new Date().getHours();
      let timeGreeting = "";
      if (hour < 12) timeGreeting = "Good Morning";
      else if (hour < 18) timeGreeting = "Good Afternoon";
      else timeGreeting = "Good Evening";

      setTimeOfDay(timeGreeting);

      // Personalized greeting based on time and role
      const greetings =
        user?.role === "student"
          ? [
              "Welcome back! Ready to track your progress?",
              "Great to see you! How are your projects coming along?",
              "Ready to achieve your milestones today?"
            ]
          : user?.role === "faculty"
            ? [
                "Welcome back! Your students value your guidance.",
                "Ready to review today's project milestones?",
                "Great to have you back in the workspace."
              ]
            : [
                "Welcome to the management console.",
                "System oversight is ready for your review.",
                "Ready to optimize organizational performance?"
              ];
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

      // Fetch dashboard data from API
      let apiData;
      try {
        if (user.role === "admin") {
          apiData = await analyticsService.getDashboardStats();
        } else if (user.role === "faculty") {
          apiData = await analyticsService.getFacultyDashboardStats();
        } else if (user.role === "student") {
          apiData = await analyticsService.getStudentDashboardStats();
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to empty data
        apiData = { data: {} };
      }

      const statsData = apiData.data || {};

      // Create role-specific dashboard data
      let data = null;

      switch (user.role) {
        case "admin":
          data = {
            title: "Administrator Dashboard",
            subtitle: "Manage system operations and monitor performance",
            stats: [
              {
                title: "Total Projects",
                value: statsData.totalProjects || 0,
                icon: ChartBarIcon,
                color: "blue",
                change: statsData.projectGrowth || "+0%",
                trend: "up",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Active Students",
                value: statsData.totalUsers || 0,
                icon: UserGroupIcon,
                color: "green",
                change: statsData.userGrowth || "+0%",
                trend: "up",
                onClick: () => navigate("/students"),
              },
              {
                title: "Pending Approvals",
                value: statsData.pendingApprovals || 0,
                icon: ClockIcon,
                color: "yellow",
                change: "Requires attention",
                trend: "attention",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Upcoming Meetings",
                value: todayMeetings.length || 0,
                icon: CalendarIcon,
                color: "purple",
                change: todayMeetings.length > 0 ? `Next: ${todayMeetings[0].time}` : "No meetings today",
                trend: "info",
                onClick: () => navigate("/meetings"),
              },
            ],
          };



          break;

        case "faculty":
          data = {
            title: "Faculty Dashboard",
            subtitle: "Guide and evaluate student projects",
            stats: [
              {
                title: "Total Projects",
                value: statsData.totalProjects || 0,
                icon: ChartBarIcon,
                color: "blue",
                change: `Your projects: ${statsData.myProjects || 0}`,
                trend: "info",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Students Assigned",
                value: statsData.activeStudents || 0,
                icon: UserGroupIcon,
                color: "green",
                change: "All active",
                trend: "info",
                onClick: () => navigate("/students"),
              },
              {
                title: "Pending Reviews",
                value: statsData.pendingReviews || 0,
                icon: ClipboardIcon,
                color: "yellow",
                change: "Due this week",
                trend: "attention",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Meetings Today",
                value: statsData.todayMeetings || 0,
                icon: CalendarIcon,
                color: "purple",
                change: "10:00 AM & 2:00 PM",
                trend: "info",
                onClick: () => navigate("/meetings"),
              },
            ],
          };



          break;

        case "student":
          data = {
            title: "Student Dashboard",
            subtitle: "Track your projects and progress",
            stats: [
              {
                title: "Total Projects",
                value: statsData.totalProjects || 0,
                icon: ChartBarIcon,
                color: "blue",
                change: `Your projects: ${statsData.myProjects || 0}`,
                trend: "info",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Assignments Due",
                value: statsData.upcomingDeadlines || 0,
                icon: ClipboardListIcon,
                color: "yellow",
                change: statsData.urgentTasks ? `${statsData.urgentTasks} urgent` : "None urgent",
                trend: "attention",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Meetings",
                value: todayMeetings.length || 0,
                icon: CalendarIcon,
                color: "purple",
                change: todayMeetings.length > 0 ? `Next: ${todayMeetings[0].time}` : "None today",
                trend: "info",
                onClick: () => navigate("/meetings"),
              },
              {
                title: "Grades",
                value: statsData.currentGrade || "N/A",
                icon: AcademicCapIcon,
                color: "green",
                change: "Current average",
                trend: "info",
                onClick: () => navigate("/profile"),
              },
            ],
          };



          break;

        default:
          data = {
            title: "Dashboard",
            subtitle: "Welcome back!",
            stats: [],
          };
      }

      if (data && data.title) {
        setDashboardData(data);
        setNotifications(statsData.notifications || []);
        setUpcomingDeadlines(statsData.upcomingDeadlines || []);
        setTodayMeetings(statsData.todayMeetings || []);
        setPerformanceData(statsData.performanceData || []);
        setRecentActivities(statsData.recentActivities || []);
        setProjectProgressData(statsData.projectProgress || []);
        setStatsData(statsData);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
      toast.error("Failed to load dashboard data");
      setDashboardData({
        title: "Dashboard",
        subtitle: "Welcome back!",
        stats: [],
      });
    }
  }, [user, navigate]);

  // Load dashboard data
  useEffect(() => {
    if (authLoading) return;

    const loadData = async () => {
      setIsLoading(true);
      await loadDashboardData();
      setIsLoading(false);
    };

    loadData();
  }, [authLoading, loadDashboardData]);

  const handleRefresh = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Refreshing dashboard...");
    try {
      await loadDashboardData();
      toast.success("Dashboard refreshed!", { id: loadingToast });
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Failed to refresh dashboard", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification actions
  const handleNotificationClick = (notificationId) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Dashboard Header with Welcome - Enhanced with animations */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <HomeIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {timeOfDay},{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {user?.name || "Student"}
                    </span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
                    {greeting}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      {user?.role === "admin"
                        ? "Administrator"
                        : user?.role === "faculty"
                          ? "Faculty"
                          : "Student"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Stats Dropdown Menu */}
              {/* <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 text-gray-700 dark:text-gray-200 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 font-medium">
                    <UserIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold">
                      {user?.name || "User"}
                    </span>
                    <ChevronRightIcon className="w-4 h-4 ml-2 text-gray-400 transform rotate-90" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-t-xl">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-3">
                      <div className="px-4 py-3 space-y-4">
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg">
                          <div className="flex items-center">
                            <FireIcon className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                              Login Streak
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                            {userActivity.streak} days
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-lg">
                          <div className="flex items-center">
                            <TrophyIcon className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                              Achievements
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                            {userActivity.achievements}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg">
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                              Last Active
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                            {userActivity.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-slate-700 py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20"
                                : ""
                            } flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium`}
                            onClick={() => navigate("/profile")}
                          >
                            <UserIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                            View Profile
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20"
                                : ""
                            } flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium`}
                            onClick={() => navigate("/settings")}
                          >
                            <CogIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu> */}
            </div>

            {/* Action Buttons with enhanced animations */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="group relative inline-flex items-center px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-transparent hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center">
                  {isLoading ? (
                    <RefreshIcon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshIcon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                  <span>
                    {isLoading ? "Refreshing..." : "Refresh Dashboard"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (user?.role === "admin") navigate("/project-types");
                  else navigate("/projects/new");
                }}
                className="group relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center">
                  <PlusIcon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-90" />
                  <span>
                    {user?.role === "admin" && "New Project Type"}
                    {user?.role === "faculty" && "New Project"}
                    {user?.role === "student" && "Submit Proposal"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  try {
                    exportDashboardToCSV(dashboardData, user?.role || "user");
                    toast.success("Report generated successfully!");
                  } catch (error) {
                    console.error("Export failed:", error);
                    toast.error("Failed to generate report");
                  }
                }}
                className="group relative inline-flex items-center px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-transparent hover:shadow-lg transition-all duration-300 font-medium overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center">
                  <DownloadIcon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-0.5" />
                  <span>Export Report</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alert Section */}
      {upcomingDeadlines.filter((d) => d.priority === "high").length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-start md:items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  ⚠️ Urgent Action Required
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {
                    upcomingDeadlines.filter((d) => d.priority === "high")[0]
                      .title
                  }{" "}
                  due{" "}
                  <span className="font-semibold">
                    {
                      upcomingDeadlines.filter((d) => d.priority === "high")[0]
                        .due
                    }
                  </span>{" "}
                  at{" "}
                  <span className="font-semibold">
                    {
                      upcomingDeadlines.filter((d) => d.priority === "high")[0]
                        .time
                    }
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex gap-3">
              <button
                onClick={() => navigate("/assignments")}
                className="group relative px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 group-hover:scale-105 inline-block transition-transform duration-300">
                  Start Now
                </span>
              </button>
              <button
                onClick={() => toast.info("Extension requested")}
                className="group relative px-5 py-2.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl hover:border-transparent hover:shadow-lg transition-all duration-300 font-medium overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-50 dark:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Request Extension</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid - Role Specific with Animations */}
      {dashboardData.stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
            <RecentActivity activities={recentActivities} userRole={user?.role} />
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg flex items-center justify-center mr-3">
                  <CalendarDaysIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Upcoming Deadlines
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Stay on track with your tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/meetings")}
                className="group text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                View calendar
                <ChevronRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`flex items-center justify-between p-5 border rounded-xl hover:shadow-md transition-all duration-300 ${
                    deadline.priority === "high"
                      ? "border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20"
                      : "border-yellow-200 dark:border-yellow-800 bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-4 ${
                        deadline.priority === "high"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {deadline.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <ClockIcon className="w-3 h-3 inline mr-1" />
                        Due {deadline.due} • {deadline.time}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      deadline.priority === "high"
                        ? "bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                        : "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                    }`}
                  >
                    {deadline.priority === "high" ? "URGENT" : "UPCOMING"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-8">
          {/* Notification Center */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg flex items-center justify-center mr-3">
                  <BellIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notifications.filter((n) => !n.read).length} unread
                  </p>
                </div>
              </div>
              <button
                onClick={markAllNotificationsAsRead}
                className="group text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105"
              >
                Mark all read
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-xl transition-all duration-300 cursor-pointer hover:shadow-sm ${
                    notification.read
                      ? "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      : "border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20"
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            notification.read
                              ? "bg-gray-300 dark:bg-gray-600"
                              : "bg-blue-500"
                          }`}
                        ></span>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                          {notification.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p
                        className={`font-medium ${
                          notification.read
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-900 dark:text-white"
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
              <UpcomingMeetings meetings={todayMeetings} userRole={user?.role} />
            </div>
          )}

          {/* Quick Resources */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 rounded-lg flex items-center justify-center mr-3">
                  <BookOpenIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Quick Access
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Frequently used resources
                  </p>
                </div>
              </div>
              <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: DocumentTextIcon,
                  label: "Materials",
                  color: "blue",
                  path: "/resources",
                },
                {
                  icon: CalendarDaysIcon,
                  label: "Calendar",
                  color: "purple",
                  path: "/meetings",
                },
                {
                  icon: ChartBarSquareIcon,
                  label: "Grades",
                  color: "green",
                  path: "/analytics/grades",
                },
                {
                  icon: AdjustmentsIcon,
                  label: "Settings",
                  color: "gray",
                  path: "/settings",
                },
              ].map((resource, index) => {
                const bgColorClass =
                  resource.color === "blue"
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : resource.color === "purple"
                      ? "bg-purple-50 dark:bg-purple-900/20"
                      : resource.color === "green"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-gray-50 dark:bg-slate-700/30";
                const iconColorClass =
                  resource.color === "blue"
                    ? "text-blue-600 dark:text-blue-400"
                    : resource.color === "purple"
                      ? "text-purple-600 dark:text-purple-400"
                      : resource.color === "green"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400";

                return (
                  <button
                    key={index}
                    onClick={() => navigate(resource.path)}
                    className="group relative p-5 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-transparent text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-700/30"
                    aria-label={resource.label}
                  >
                    <div
                      className={`absolute inset-0 ${bgColorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <div
                        className={`${iconColorClass} flex justify-center mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1`}
                      >
                        <resource.icon className="w-7 h-7" aria-hidden="true" />
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white transition-colors">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-lg flex items-center justify-center mr-3">
                  <ChartBarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Project Progress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Track project completion
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/projects")}
                className="group text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                View all
                <ChevronRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <ProgressVisualization projects={projectProgressData} userRole={user?.role} />
          </div>

        {/* System Metrics */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg flex items-center justify-center mr-3 border border-blue-800/30">
                  <ChartPieIcon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">System Metrics</h3>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Live performance monitoring
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-900/40 to-green-800/30 text-green-400 rounded-full border border-green-800/30 font-bold">
                LIVE
              </span>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: ServerIcon,
                label: "System Performance",
                value: `${statsData.systemPerformance || 92}%`,
                change: statsData.performanceChange || "+2.5%",
                color: "green",
                progress: statsData.systemPerformance || 92,
              },
              {
                icon: BoltIcon,
                label: "Response Time",
                value: `${statsData.responseTime || 128}ms`,
                change: statsData.responseTimeChange || "-12ms",
                color: "blue",
                progress: 85,
              },
              {
                icon: UserGroupIcon,
                label: "Active Users",
                value: statsData.activeUsers || 156,
                change: statsData.userChange || "+8",
                color: "purple",
                progress: 75,
              },
              {
                icon: ShieldCheckIcon,
                label: "Data Accuracy",
                value: statsData.dataAccuracy || "99.8%",
                change: "Verified",
                color: "green",
                progress: 99,
              },
            ].map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <metric.icon
                      className={`w-5 h-5 mr-3 ${
                        metric.color === "green"
                          ? "text-green-400"
                          : metric.color === "blue"
                            ? "text-blue-400"
                            : "text-purple-400"
                      }`}
                    />
                    <span className="font-medium text-gray-300">
                      {metric.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{metric.value}</span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        metric.color === "green"
                          ? "bg-gradient-to-r from-green-900/40 to-green-800/30 text-green-400 border border-green-800/30"
                          : metric.color === "blue"
                            ? "bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-blue-400 border border-blue-800/30"
                            : "bg-gradient-to-r from-purple-900/40 to-purple-800/30 text-purple-400 border border-purple-800/30"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.color === "green"
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : metric.color === "blue"
                          ? "bg-gradient-to-r from-blue-500 to-blue-400"
                          : "bg-gradient-to-r from-purple-500 to-purple-400"
                    }`}
                    style={{ width: `${metric.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="text-sm text-gray-400">Last updated</div>
            <div className="text-lg font-bold flex items-center">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse ml-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Content */}
      {user?.role === "admin" && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-3">
                  Administrator Alerts
                </h4>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 3).map((notif, idx) => (
                      <p key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                        {notif.message}
                      </p>
                    ))
                  ) : (
                    <p className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                      No urgent alerts at this time.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-xl hover:shadow-lg hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300 font-medium shadow-md whitespace-nowrap"
            >
              Manage Alerts
            </button>
          </div>
        </div>
      )}

      {user?.role === "student" && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <LightBulbIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-3">
                  Study Tip of the Day
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  Break your study sessions into 25-minute focused intervals
                  with 5-minute breaks (Pomodoro Technique). This improves
                  retention and prevents burnout.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/resources")}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-medium shadow-md whitespace-nowrap"
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
