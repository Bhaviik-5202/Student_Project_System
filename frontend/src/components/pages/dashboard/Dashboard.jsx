import { useAuth } from "../../../context/AuthContext";
import StatCard from "../../ui/StatCard";
import RecentActivity from "./RecentActivity";
import UpcomingMeetings from "./UpcomingMeetings";

const Dashboard = () => {
  const { user } = useAuth();

  // Role-specific stats
  const getStats = () => {
    if (user?.role === "admin") {
      return [
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
      ];
    } else if (user?.role === "faculty") {
      return [
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
      ];
    } else if (user?.role === "student") {
      return [
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
      ];
    }

    return [];
  };

  const subtitle = {
    admin: "Administrator Dashboard - Manage system operations",
    faculty: "Faculty Dashboard - Guide and evaluate student projects",
    student: "Student Dashboard - Track your projects and progress",
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">
            {subtitle[user?.role] ||
              "Welcome back! Here's what's happening today."}
          </p>
        </div>
        <div className="flex space-x-3">
          {user?.role === "admin" && (
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center">
              <i className="fas fa-plus mr-2"></i> New Project
            </button>
          )}
          {user?.role === "student" && (
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center">
              <i className="fas fa-file-upload mr-2"></i> Submit Proposal
            </button>
          )}
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 flex items-center">
            <i className="fas fa-download mr-2"></i> Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getStats().map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Role-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity userRole={user?.role} />
        <UpcomingMeetings userRole={user?.role} />
      </div>
    </div>
  );
};

export default Dashboard;
