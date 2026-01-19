import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UsageStatistics = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    activeUsers: { current: 156, change: "+8%" },
    dailyLogins: { current: 234, change: "+12%" },
    pageViews: { current: "1.2K", change: "+15%" },
    storageUsed: { current: "45.2 GB", change: "+5%" },
  });

  const [usageData] = useState([
    { feature: "Projects", usage: 95, users: 148 },
    { feature: "Assignments", usage: 88, users: 137 },
    { feature: "Discussions", usage: 72, users: 112 },
    { feature: "File Sharing", usage: 65, users: 101 },
    { feature: "Calendar", usage: 58, users: 90 },
    { feature: "Reports", usage: 42, users: 65 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Usage Statistics
            </h1>
            <p className="text-gray-600">System usage and engagement metrics</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Download Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(stats).map(([key, metric]) => (
            <div
              key={key}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {metric.current}
                </div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>{metric.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage by Feature */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Feature Usage Distribution
          </h3>
          <div className="space-y-4">
            {usageData.map((feature, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <div className="font-medium text-gray-900">
                    {feature.feature}
                  </div>
                  <div>
                    {feature.usage}% usage ({feature.users} users)
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      feature.usage >= 80
                        ? "bg-green-500"
                        : feature.usage >= 60
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: `${feature.usage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Active Users
            </h3>
            <div className="space-y-4">
              {[
                { day: "Mon", users: 156, trend: "up" },
                { day: "Tue", users: 162, trend: "up" },
                { day: "Wed", users: 158, trend: "stable" },
                { day: "Thu", users: 170, trend: "up" },
                { day: "Fri", users: 165, trend: "down" },
                { day: "Sat", users: 142, trend: "down" },
                { day: "Sun", users: 135, trend: "down" },
              ].map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{day.day}</div>
                  <div className="flex items-center">
                    <div className="text-gray-900 mr-3">{day.users}</div>
                    <div
                      className={`text-sm ${
                        day.trend === "up"
                          ? "text-green-600"
                          : day.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {day.trend === "up"
                        ? "↗"
                        : day.trend === "down"
                        ? "↘"
                        : "→"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Peak Usage Hours
            </h3>
            <div className="space-y-4">
              {[
                { hour: "9 AM", usage: 85 },
                { hour: "10 AM", usage: 92 },
                { hour: "11 AM", usage: 88 },
                { hour: "12 PM", usage: 78 },
                { hour: "1 PM", usage: 82 },
                { hour: "2 PM", usage: 95 },
                { hour: "3 PM", usage: 90 },
              ].map((hour, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{hour.hour}</span>
                    <span>{hour.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${hour.usage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStatistics;
