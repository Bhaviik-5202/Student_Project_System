import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Fragment } from "react";
import RecentActivity from "./RecentActivity";
import UpcomingMeetings from "./UpcomingMeetings";

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
    lastActive: "2 hours ago",
    streak: 5,
    achievements: 3,
  });

  // Memoize the loadDashboardData function
  const loadDashboardData = useCallback(() => {
    try {
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
      const studentGreetings = [
        "Ready to tackle today's assignments?",
        "Great to see you back! Ready to learn?",
        "Let's make today productive and insightful!",
        "Your progress looks amazing! Keep it up!",
        "Time to achieve great things today!",
      ];

      const facultyGreetings = [
        "Ready to guide today's learning?",
        "Great to have you back! Students await your guidance.",
        "Let's make today impactful for our students!",
        "Your mentorship makes a difference!",
        "Time to inspire and educate today!",
      ];

      const adminGreetings = [
        "Ready to manage today's operations?",
        "Great to see you back! System awaits your oversight.",
        "Let's ensure everything runs smoothly today!",
        "Your management keeps everything on track!",
        "Time to optimize and improve today!",
      ];

      const greetings =
        user?.role === "student"
          ? studentGreetings
          : user?.role === "faculty"
            ? facultyGreetings
            : adminGreetings;
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

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
                value: "48",
                icon: ChartBarIcon,
                color: "blue",
                change: "+12% from last month",
                trend: "up",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Active Students",
                value: "156",
                icon: UserGroupIcon,
                color: "green",
                change: "+8% from last month",
                trend: "up",
                onClick: () => navigate("/students"),
              },
              {
                title: "Pending Approvals",
                value: "7",
                icon: ClockIcon,
                color: "yellow",
                change: "Requires attention",
                trend: "attention",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Upcoming Meetings",
                value: "5",
                icon: CalendarIcon,
                color: "purple",
                change: "Next: Tomorrow",
                trend: "info",
                onClick: () => navigate("/meetings"),
              },
            ],
          };

          // Sample notifications for admin
          setNotifications([
            {
              id: 1,
              type: "announcement",
              message: "System maintenance scheduled for Sunday",
              time: "2h ago",
              read: false,
            },
            {
              id: 2,
              type: "approval",
              message: "3 new project approvals pending",
              time: "4h ago",
              read: false,
            },
            {
              id: 3,
              type: "alert",
              message: "Storage at 85% capacity",
              time: "1d ago",
              read: true,
            },
          ]);

          setUpcomingDeadlines([
            {
              id: 1,
              title: "Budget Report",
              due: "Tomorrow",
              time: "9:00 AM",
              priority: "high",
            },
            {
              id: 2,
              title: "Faculty Review",
              due: "Jan 20",
              time: "2:00 PM",
              priority: "medium",
            },
          ]);

          break;

        case "faculty":
          data = {
            title: "Faculty Dashboard",
            subtitle: "Guide and evaluate student projects",
            stats: [
              {
                title: "My Projects",
                value: "12",
                icon: ChartBarIcon,
                color: "blue",
                change: "+2 new projects",
                trend: "up",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Students Assigned",
                value: "24",
                icon: UserGroupIcon,
                color: "green",
                change: "All active",
                trend: "info",
                onClick: () => navigate("/students"),
              },
              {
                title: "Pending Reviews",
                value: "3",
                icon: ClipboardIcon,
                color: "yellow",
                change: "Due this week",
                trend: "attention",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Meetings Today",
                value: "2",
                icon: CalendarIcon,
                color: "purple",
                change: "10:00 AM & 2:00 PM",
                trend: "info",
                onClick: () => navigate("/meetings"),
              },
            ],
          };

          setNotifications([
            {
              id: 1,
              type: "student",
              message: "John submitted Math assignment",
              time: "1h ago",
              read: false,
            },
            {
              id: 2,
              type: "meeting",
              message: "Department meeting at 3 PM",
              time: "Today",
              read: false,
            },
          ]);

          setUpcomingDeadlines([
            {
              id: 1,
              title: "Grade Submission",
              due: "Tomorrow",
              time: "5:00 PM",
              priority: "high",
            },
            {
              id: 2,
              title: "Course Materials",
              due: "Jan 18",
              time: "10:00 AM",
              priority: "medium",
            },
          ]);

          break;

        case "student":
          data = {
            title: "Student Dashboard",
            subtitle: "Track your projects and progress",
            stats: [
              {
                title: "My Projects",
                value: "2",
                icon: ChartBarIcon,
                color: "blue",
                change: "1 active, 1 completed",
                trend: "info",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Assignments Due",
                value: "3",
                icon: ClipboardListIcon,
                color: "yellow",
                change: "Due next week",
                trend: "attention",
                onClick: () => navigate("/projects"),
              },
              {
                title: "Meetings",
                value: "1",
                icon: CalendarIcon,
                color: "purple",
                change: "Tomorrow at 2:00 PM",
                trend: "info",
                onClick: () => navigate("/meetings"),
              },
              {
                title: "Grades",
                value: "A-",
                icon: AcademicCapIcon,
                color: "green",
                change: "Current average",
                trend: "info",
                onClick: () => navigate("/profile"),
              },
            ],
          };

          // Enhanced data for students
          setNotifications([
            {
              id: 1,
              type: "assignment",
              message: "Math assignment due tomorrow",
              time: "2h ago",
              read: false,
            },
            {
              id: 2,
              type: "grade",
              message: "Science quiz graded: A-",
              time: "Yesterday",
              read: true,
            },
            {
              id: 3,
              type: "announcement",
              message: "New course materials uploaded",
              time: "2d ago",
              read: true,
            },
          ]);

          setUpcomingDeadlines([
            {
              id: 1,
              title: "Math Assignment",
              due: "Tomorrow",
              time: "2:00 PM",
              priority: "high",
            },
            {
              id: 2,
              title: "Science Paper",
              due: "Jan 18",
              time: "11:59 PM",
              priority: "medium",
            },
            {
              id: 3,
              title: "History Quiz",
              due: "Jan 20",
              time: "9:00 AM",
              priority: "medium",
            },
          ]);

          setTodayMeetings([
            {
              id: 1,
              title: "Math Tutoring",
              time: "2:00 PM",
              type: "academic",
              location: "Room 302",
            },
            {
              id: 2,
              title: "Group Study Session",
              time: "4:30 PM",
              type: "study",
              location: "Library",
            },
          ]);

          setPerformanceData([
            { month: "Sep", gpa: 3.4 },
            { month: "Oct", gpa: 3.6 },
            { month: "Nov", gpa: 3.8 },
            { month: "Dec", gpa: 3.7 },
            { month: "Jan", gpa: 3.7 },
          ]);

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

    setIsLoading(true);
    const timer = setTimeout(() => {
      loadDashboardData();
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [loadDashboardData, authLoading]);

  const handleRefresh = () => {
    setIsLoading(true);
    toast.loading("Refreshing dashboard...");
    setTimeout(() => {
      loadDashboardData();
      setIsLoading(false);
      toast.dismiss();
      toast.success("Dashboard refreshed!");
    }, 800);
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-600">
            Preparing your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Dashboard Header with Welcome */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <HomeIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {timeOfDay},{" "}
                    <span className="text-blue-600">
                      {user?.name || "Student"}
                    </span>
                  </h1>
                  <p className="text-gray-600 mt-1 text-lg">{greeting}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200">
                      {user?.role === "admin"
                        ? "Administrator"
                        : user?.role === "faculty"
                          ? "Faculty"
                          : "Student"}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
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
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-50 to-white text-gray-700 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 font-medium">
                    <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
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
                  <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-3">
                      {/* User Stats in Dropdown */}
                      <div className="px-4 py-3 space-y-4">
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-orange-50 to-orange-25 rounded-lg">
                          <div className="flex items-center">
                            <FireIcon className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="text-sm text-gray-700 font-medium">
                              Login Streak
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-full">
                            {userActivity.streak} days
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-yellow-25 rounded-lg">
                          <div className="flex items-center">
                            <TrophyIcon className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="text-sm text-gray-700 font-medium">
                              Achievements
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-full">
                            {userActivity.achievements}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg">
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-700 font-medium">
                              Last Active
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-full">
                            {userActivity.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gradient-to-r from-blue-50 to-blue-25"
                                : ""
                            } flex items-center w-full px-4 py-3 text-sm text-gray-700 font-medium`}
                            onClick={() => navigate("/profile")}
                          >
                            <UserIcon className="w-4 h-4 mr-3 text-gray-500" />
                            View Profile
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gradient-to-r from-blue-50 to-blue-25"
                                : ""
                            } flex items-center w-full px-4 py-3 text-sm text-gray-700 font-medium`}
                            onClick={() => navigate("/settings")}
                          >
                            <CogIcon className="w-4 h-4 mr-3 text-gray-500" />
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-300 font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshIcon className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshIcon className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Refreshing..." : "Refresh Dashboard"}
              </button>

              <button
                onClick={() => {
                  if (user?.role === "admin") navigate("/projects/types");
                  else if (user?.role === "faculty") navigate("/projects");
                  else navigate("/projects/proposal");
                }}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-medium shadow-md"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {user?.role === "admin" && "New Project Type"}
                {user?.role === "faculty" && "New Project"}
                {user?.role === "student" && "Submit Proposal"}
              </button>

              <button
                onClick={() => toast.info("Export feature coming soon!")}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-300 font-medium"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alert Section */}
      {upcomingDeadlines.filter((d) => d.priority === "high").length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-25 border border-red-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-start md:items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  ⚠️ Urgent Action Required
                </h3>
                <p className="text-gray-700">
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
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 font-medium shadow-md"
              >
                Start Now
              </button>
              <button
                onClick={() => toast.info("Extension requested")}
                className="px-5 py-2.5 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-300 font-medium"
              >
                Request Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid - Role Specific */}
      {dashboardData.stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.stats.map((stat, index) => {
            const Icon = stat.icon;
            const bgColor =
              stat.color === "blue"
                ? "bg-gradient-to-br from-blue-50 to-blue-25"
                : stat.color === "green"
                  ? "bg-gradient-to-br from-green-50 to-green-25"
                  : stat.color === "yellow"
                    ? "bg-gradient-to-br from-yellow-50 to-yellow-25"
                    : "bg-gradient-to-br from-purple-50 to-purple-25";
            const iconColor =
              stat.color === "blue"
                ? "text-blue-600"
                : stat.color === "green"
                  ? "text-green-600"
                  : stat.color === "yellow"
                    ? "text-yellow-600"
                    : "text-purple-600";
            const borderColor =
              stat.color === "blue"
                ? "border-blue-100"
                : stat.color === "green"
                  ? "border-green-100"
                  : stat.color === "yellow"
                    ? "border-yellow-100"
                    : "border-purple-100";

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl border ${borderColor} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group`}
                onClick={stat.onClick}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center border ${borderColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      stat.trend === "up"
                        ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200"
                        : stat.trend === "attention"
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  {stat.title}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium flex items-center group-hover:underline">
                    View details
                    <ChevronRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <RecentActivity userRole={user?.role} />
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-orange-25 rounded-lg flex items-center justify-center mr-3">
                  <CalendarDaysIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Upcoming Deadlines
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Stay on track with your tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/calendar")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors duration-300"
              >
                View calendar
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`flex items-center justify-between p-5 border rounded-xl hover:shadow-md transition-all duration-300 ${
                    deadline.priority === "high"
                      ? "border-red-200 bg-gradient-to-r from-red-50 to-red-25"
                      : "border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-25"
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
                      <div className="font-bold text-gray-900">
                        {deadline.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <ClockIcon className="w-3 h-3 inline mr-1" />
                        Due {deadline.due} • {deadline.time}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      deadline.priority === "high"
                        ? "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200"
                        : "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200"
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-25 rounded-lg flex items-center justify-center mr-3">
                  <BellIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {notifications.filter((n) => !n.read).length} unread
                  </p>
                </div>
              </div>
              <button
                onClick={markAllNotificationsAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors duration-300"
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
                      ? "border-gray-200 bg-white"
                      : "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-25"
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            notification.read ? "bg-gray-300" : "bg-blue-500"
                          }`}
                        ></span>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-700">
                          {notification.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p
                        className={`font-medium ${
                          notification.read ? "text-gray-700" : "text-gray-900"
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
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-25 rounded-lg flex items-center justify-center mr-3">
                    <UserGroupIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Today's Meetings
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your schedule for today
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/meetings")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors duration-300"
                >
                  Schedule
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>

              <div className="space-y-4">
                {todayMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-5 bg-gradient-to-r from-blue-50 to-blue-25 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-gray-900">
                        {meeting.title}
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">
                        {meeting.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium">{meeting.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <LocationMarkerIcon className="w-4 h-4 mr-2 text-blue-500" />
                      {meeting.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Resources */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-25 rounded-lg flex items-center justify-center mr-3">
                  <BookOpenIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Quick Access
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Frequently used resources
                  </p>
                </div>
              </div>
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: DocumentTextIcon, label: "Materials", color: "blue" },
                { icon: CalendarDaysIcon, label: "Calendar", color: "purple" },
                { icon: ChartBarSquareIcon, label: "Grades", color: "green" },
                { icon: AdjustmentsIcon, label: "Settings", color: "gray" },
              ].map((resource, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/${resource.label.toLowerCase()}`)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${
                      resource.color === "blue"
                        ? "bg-gradient-to-br from-blue-50 to-blue-25"
                        : resource.color === "purple"
                          ? "bg-gradient-to-br from-purple-50 to-purple-25"
                          : resource.color === "green"
                            ? "bg-gradient-to-br from-green-50 to-green-25"
                            : "bg-gradient-to-br from-gray-50 to-gray-25"
                    }`}
                  >
                    <resource.icon
                      className={`w-6 h-6 ${
                        resource.color === "blue"
                          ? "text-blue-600"
                          : resource.color === "purple"
                            ? "text-purple-600"
                            : resource.color === "green"
                              ? "text-green-600"
                              : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {resource.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-indigo-25 rounded-lg flex items-center justify-center mr-3">
                <ChartBarIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Project Progress
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Track your project completion
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/projects")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors duration-300"
            >
              View all
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Progress Visualization */}
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600">Average Completion</div>
                <div className="text-3xl font-bold text-gray-900">72.5%</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">On Track</div>
                <div className="flex items-center text-green-600 font-bold">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  <span>+5.2%</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: "72.5%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Research", progress: 85, color: "blue" },
              { label: "Design", progress: 65, color: "purple" },
              { label: "Development", progress: 45, color: "green" },
              { label: "Testing", progress: 25, color: "yellow" },
            ].map((project, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-xl"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {project.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      project.color === "blue"
                        ? "bg-gradient-to-r from-blue-500 to-blue-400"
                        : project.color === "purple"
                          ? "bg-gradient-to-r from-purple-500 to-purple-400"
                          : project.color === "green"
                            ? "bg-gradient-to-r from-green-500 to-green-400"
                            : "bg-gradient-to-r from-yellow-500 to-yellow-400"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
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
                value: "92%",
                change: "+2.5%",
                color: "green",
                progress: 92,
              },
              {
                icon: BoltIcon,
                label: "Response Time",
                value: "128ms",
                change: "-12ms",
                color: "blue",
                progress: 85,
              },
              {
                icon: UserGroupIcon,
                label: "Active Users",
                value: "156",
                change: "+8",
                color: "purple",
                progress: 75,
              },
              {
                icon: ShieldCheckIcon,
                label: "Data Accuracy",
                value: "99.8%",
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
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-25 border border-yellow-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-yellow-800 mb-3">
                  Administrator Alerts
                </h4>
                <div className="text-sm text-yellow-700 space-y-2">
                  <p className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    3 projects awaiting approval
                  </p>
                  <p className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    2 meeting rooms unavailable tomorrow
                  </p>
                  <p className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    System backup scheduled for 2:00 AM
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/alerts")}
              className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-xl hover:shadow-lg hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300 font-medium shadow-md whitespace-nowrap"
            >
              Manage Alerts
            </button>
          </div>
        </div>
      )}

      {user?.role === "student" && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <LightBulbIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-blue-800 mb-3">
                  Study Tip of the Day
                </h4>
                <p className="text-blue-700">
                  Break your study sessions into 25-minute focused intervals
                  with 5-minute breaks (Pomodoro Technique). This improves
                  retention and prevents burnout.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/resources/study-tips")}
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
