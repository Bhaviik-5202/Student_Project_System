import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    totalStudents: 156,
    activeProjects: 48,
    avgGrade: 82.5,
    completionRate: 74,
  });

  const [performanceData] = useState([
    { month: "Sep", projects: 12, grades: 78 },
    { month: "Oct", projects: 15, grades: 80 },
    { month: "Nov", projects: 18, grades: 82 },
    { month: "Dec", projects: 20, grades: 84 },
    { month: "Jan", projects: 22, grades: 85 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              System performance and analytics overview
            </p>
          </div>
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
                  {stats.totalStudents}
                </div>
                <div className="text-gray-600">Total Students</div>
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-purple-600">⭐</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.avgGrade}%
                </div>
                <div className="text-gray-600">Average Grade</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-yellow-600">📈</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </div>
                <div className="text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Trends
            </h3>
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.month}</span>
                    <span>
                      Projects: {item.projects} | Grade: {item.grades}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.grades}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Distribution
            </h3>
            <div className="space-y-4">
              {[
                { label: "Project Work", value: 45, color: "bg-blue-500" },
                { label: "Assignments", value: 25, color: "bg-green-500" },
                { label: "Research", value: 15, color: "bg-purple-500" },
                { label: "Meetings", value: 10, color: "bg-yellow-500" },
                { label: "Other", value: 5, color: "bg-gray-500" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-900">{item.label}</span>
                    <span className="text-gray-600">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
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

export default AnalyticsDashboard;
