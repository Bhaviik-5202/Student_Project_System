import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import StatCard from "../../ui/StatCard";
import RecentActivity from "./RecentActivity";
import UpcomingMeetings from "./UpcomingMeetings";

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      loadDashboardData();
      setIsLoading(false);
    }, 300);
  }, []);

  const loadDashboardData = () => {
    // Role-specific dashboard data
    if (user?.role === "admin") {
      setDashboardData({
        title: "Administrator Dashboard",
        subtitle: "Manage system operations and monitor performance",
        stats: [
          {
            title: "Total Projects",
            value: "48",
            icon: "fa-project-diagram",
            color: "blue",
            change: "+12% from last month",
            trend: "up",
          },
          {
            title: "Active Students",
            value: "156",
            icon: "fa-users",
            color: "green",
            change: "+8% from last month",
            trend: "up",
          },
          {
            title: "Pending Approvals",
            value: "7",
            icon: "fa-clock",
            color: "yellow",
            change: "Requires attention",
            trend: "attention",
          },
          {
            title: "Upcoming Meetings",
            value: "5",
            icon: "fa-calendar-alt",
            color: "purple",
            change: "Next: Tomorrow",
            trend: "info",
          },
        ],
      });
    } else if (user?.role === "faculty") {
      setDashboardData({
        title: "Faculty Dashboard",
        subtitle: "Guide and evaluate student projects",
        stats: [
          {
            title: "My Projects",
            value: "12",
            icon: "fa-project-diagram",
            color: "blue",
            change: "+2 new projects",
            trend: "up",
          },
          {
            title: "Students Assigned",
            value: "24",
            icon: "fa-users",
            color: "green",
            change: "All active",
            trend: "info",
          },
          {
            title: "Pending Reviews",
            value: "3",
            icon: "fa-clipboard-check",
            color: "yellow",
            change: "Due this week",
            trend: "attention",
          },
          {
            title: "Meetings Today",
            value: "2",
            icon: "fa-calendar-alt",
            color: "purple",
            change: "10:00 AM & 2:00 PM",
            trend: "info",
          },
        ],
      });
    } else if (user?.role === "student") {
      setDashboardData({
        title: "Student Dashboard",
        subtitle: "Track your projects and progress",
        stats: [
          {
            title: "My Projects",
            value: "2",
            icon: "fa-project-diagram",
            color: "blue",
            change: "1 active, 1 completed",
            trend: "info",
          },
          {
            title: "Assignments Due",
            value: "3",
            icon: "fa-tasks",
            color: "yellow",
            change: "Due next week",
            trend: "attention",
          },
          {
            title: "Meetings",
            value: "1",
            icon: "fa-calendar-alt",
            color: "purple",
            change: "Tomorrow at 2:00 PM",
            trend: "info",
          },
          {
            title: "Grades",
            value: "A-",
            icon: "fa-graduation-cap",
            color: "green",
            change: "Current average",
            trend: "info",
          },
        ],
      });
    } else {
      // Default data
      setDashboardData({
        title: "Dashboard",
        subtitle: "Welcome back!",
        stats: [],
      });
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadDashboardData();
      setIsLoading(false);
    }, 500);
  };

  const handleQuickAction = (action) => {
    // Add click effect animation
    const buttons = document.querySelectorAll(".quick-action-btn");
    buttons.forEach((btn) => {
      btn.classList.remove("animate-pulse");
    });

    const clickedBtn = event?.currentTarget;
    if (clickedBtn) {
      clickedBtn.classList.add("animate-pulse");
      setTimeout(() => {
        clickedBtn.classList.remove("animate-pulse");
      }, 300);
    }

    // Handle different quick actions
    switch (action) {
      case "schedule":
        if (user?.role === "admin" || user?.role === "faculty") {
          alert(
            "📅 Opening meeting scheduler...\n\nYou can schedule new meetings, review upcoming ones, or manage existing schedules."
          );
          // In real app: navigate to /meetings or open modal
        } else {
          alert(
            "📅 Viewing your meeting schedule...\n\nCheck your upcoming meetings and review past meetings."
          );
        }
        break;

      case "upload":
        if (user?.role === "student") {
          alert(
            "📤 Opening file upload for project submission...\n\nUpload your project files, proposals, or assignments here."
          );
          // In real app: navigate to /proposal or open file upload
        } else if (user?.role === "faculty") {
          alert(
            "📤 Opening material upload for students...\n\nUpload course materials, assignments, or resources for your students."
          );
        } else {
          alert(
            "📤 Opening document upload...\n\nUpload system documents, templates, or resources."
          );
        }
        break;

      case "reports":
        alert(
          "📊 Opening reports dashboard...\n\nView analytics, generate reports, or export data."
        );
        // In real app: navigate to /reports
        break;

      case "alerts":
        if (user?.role === "admin") {
          alert(
            "🔔 Opening system alerts panel...\n\nView system notifications, warnings, and important updates."
          );
        } else {
          alert(
            "🔔 Viewing your notifications...\n\nCheck your personal alerts and updates."
          );
        }
        break;

      case "teams":
        if (user?.role === "student") {
          alert(
            "👥 Viewing your project team...\n\nSee team members, contact information, and shared documents."
          );
        } else if (user?.role === "faculty") {
          alert(
            "👥 Opening student groups management...\n\nManage student teams, assign projects, and track group progress."
          );
        } else {
          alert(
            "👥 Opening team management...\n\nManage faculty teams, departments, and staff assignments."
          );
        }
        break;

      case "settings":
        alert(
          "⚙️ Opening settings...\n\nConfigure your profile, preferences, and account settings."
        );
        // In real app: navigate to /settings
        break;

      default:
        alert("Action not available");
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Loading Dashboard...
            </h2>
            <p className="text-gray-600">Please wait while we load your data</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner-simple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {dashboardData.title}
            </h2>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 ml-1 font-medium">
                Live
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-1">{dashboardData.subtitle}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center">
              <i className="fas fa-calendar-day mr-1"></i>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center">
              <i className="fas fa-clock mr-1"></i>
              Last updated: Just now
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 flex items-center disabled:opacity-50"
          >
            <i
              className={`fas fa-sync-alt mr-2 ${
                isLoading ? "animate-spin" : ""
              }`}
            ></i>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>

          {user?.role === "admin" && (
            <button
              onClick={() => handleQuickAction("upload")}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> New Project
            </button>
          )}

          {user?.role === "student" && (
            <button
              onClick={() => handleQuickAction("upload")}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center"
            >
              <i className="fas fa-file-upload mr-2"></i> Submit Proposal
            </button>
          )}

          <button
            onClick={() => handleQuickAction("reports")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 flex items-center"
          >
            <i className="fas fa-download mr-2"></i> Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {dashboardData.stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.stats.map((stat, index) => (
            <div
              key={index}
              className="opacity-0 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">System Status</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">
                  All Systems Operational
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Response Time</div>
              <div className="text-sm font-medium text-gray-900">128ms</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Users Online</div>
              <div className="text-sm font-medium text-gray-900">156</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <span className="text-xs text-gray-500">Performance:</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: "92%" }}
              ></div>
            </div>
            <span className="text-xs font-medium text-green-600">92%</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RecentActivity userRole={user?.role} />

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickAction("schedule")}
                className="quick-action-btn flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors duration-150">
                  <i className="fas fa-calendar-plus text-blue-600 group-hover:text-blue-700"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Schedule
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("upload")}
                className="quick-action-btn flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors duration-150">
                  <i className="fas fa-file-upload text-green-600 group-hover:text-green-700"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-green-600">
                  Upload
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("reports")}
                className="quick-action-btn flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors duration-150">
                  <i className="fas fa-chart-line text-purple-600 group-hover:text-purple-700"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                  Reports
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("alerts")}
                className="quick-action-btn flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-yellow-300 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-yellow-200 transition-colors duration-150">
                  <i className="fas fa-bell text-yellow-600 group-hover:text-yellow-700"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-yellow-600">
                  Alerts
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("teams")}
                className="quick-action-btn flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-red-200 transition-colors duration-150">
                  <i className="fas fa-users text-red-600 group-hover:text-red-700"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                  Teams
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("settings")}
                className="quick-action-btn flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-colors duration-150">
                  <i className="fas fa-cog text-indigo-600 group-hover:text-indigo-700"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                  Settings
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <UpcomingMeetings userRole={user?.role} />

          {/* Project Progress Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Progress
              </h3>
              <button
                onClick={() => handleQuickAction("reports")}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "E-commerce Platform",
                  progress: 65,
                  color: "blue",
                  team: "Group A",
                },
                {
                  name: "AI Chatbot",
                  progress: 100,
                  color: "green",
                  team: "Group B",
                },
                {
                  name: "IoT Smart Home",
                  progress: 45,
                  color: "yellow",
                  team: "Group C",
                },
                {
                  name: "Mobile App",
                  progress: 80,
                  color: "purple",
                  team: "Group D",
                },
              ].map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          project.color === "blue"
                            ? "bg-blue-500"
                            : project.color === "green"
                            ? "bg-green-500"
                            : project.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-purple-500"
                        }`}
                      ></div>
                      <span className="font-medium text-gray-900">
                        {project.name}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ({project.team})
                      </span>
                    </div>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        project.color === "blue"
                          ? "bg-blue-500"
                          : project.color === "green"
                          ? "bg-green-500"
                          : project.color === "yellow"
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                      } transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Completion</span>
                <span className="font-medium text-gray-900">72.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  style={{ width: "72.5%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {user?.role === "admin" && (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-yellow-800">
                System Alerts
              </h4>
              <div className="mt-1 text-sm text-yellow-700">
                <p>
                  • 3 projects awaiting approval • 2 meeting rooms unavailable
                  tomorrow • Backup scheduled for 2:00 AM
                </p>
              </div>
            </div>
            <button
              onClick={() => handleQuickAction("alerts")}
              className="ml-4 text-sm font-medium text-yellow-800 hover:text-yellow-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
