import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    totalUsers: 156,
    activeProjects: 48,
    pendingApprovals: 7,
    systemHealth: 95,
  });

  const [recentActivities] = useState([
    {
      id: 1,
      user: "John Doe",
      action: "Created new project",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Admin",
      action: "Updated system settings",
      time: "5 hours ago",
    },
    {
      id: 3,
      user: "Jane Smith",
      action: "Submitted project proposal",
      time: "1 day ago",
    },
    {
      id: 4,
      user: "System",
      action: "Automatic backup completed",
      time: "2 days ago",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            System overview and administration controls
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-blue-600">👥</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </div>
                <div className="text-gray-600">Total Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-green-600">📊</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeProjects}
                </div>
                <div className="text-gray-600">Active Projects</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-yellow-600">⏳</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.pendingApprovals}
                </div>
                <div className="text-gray-600">Pending Approvals</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-purple-600">💻</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.systemHealth}%
                </div>
                <div className="text-gray-600">System Health</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/admin/users")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-blue-600 text-lg mb-2">👤</div>
                <div className="font-medium text-gray-900">User Management</div>
              </button>
              <button
                onClick={() => navigate("/admin/settings")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-green-600 text-lg mb-2">⚙️</div>
                <div className="font-medium text-gray-900">System Settings</div>
              </button>
              <button
                onClick={() => navigate("/admin/audit")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-purple-600 text-lg mb-2">📋</div>
                <div className="font-medium text-gray-900">Audit Log</div>
              </button>
              <button
                onClick={() => navigate("/admin/backup")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-yellow-600 text-lg mb-2">💾</div>
                <div className="font-medium text-gray-900">Backup</div>
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {activity.user}
                    </div>
                    <div className="text-sm text-gray-600">
                      {activity.action}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h3>
          <div className="space-y-4">
            {[
              { service: "Database", status: "Online", uptime: "99.9%" },
              { service: "File Storage", status: "Online", uptime: "99.8%" },
              { service: "Email Service", status: "Online", uptime: "99.7%" },
              { service: "API Server", status: "Online", uptime: "99.9%" },
            ].map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      service.status === "Online"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {service.service}
                    </div>
                    <div className="text-sm text-gray-600">
                      {service.status}
                    </div>
                  </div>
                </div>
                <div className="text-gray-900 font-medium">
                  {service.uptime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
