import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const AnalyticsDashboard = memo(() => {
  const navigate = useNavigate();
  const stats = useMemo(
    () => ({
      totalStudents: 156,
      activeProjects: 48,
      avgGrade: 82.5,
      completionRate: 74,
    }),
    [],
  );

  const performanceData = useMemo(
    () => [
      { month: "Sep", projects: 12, grades: 78 },
      { month: "Oct", projects: 15, grades: 80 },
      { month: "Nov", projects: 18, grades: 82 },
      { month: "Dec", projects: 20, grades: 84 },
      { month: "Jan", projects: 22, grades: 85 },
    ],
    [],
  );

  const activityData = useMemo(
    () => [
      { label: "Project Work", value: 45, color: "bg-blue-500" },
      { label: "Assignments", value: 25, color: "bg-emerald-500" },
      { label: "Research", value: 15, color: "bg-purple-500" },
      { label: "Meetings", value: 10, color: "bg-amber-500" },
      { label: "Other", value: 5, color: "bg-slate-500" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              System performance and analytics overview
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-user-graduate text-xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalStudents}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Total Students
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-project-diagram text-xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.activeProjects}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Active Projects
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-star text-xl text-purple-600 dark:text-purple-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.avgGrade}%
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Average Grade
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-chart-line text-xl text-amber-600 dark:text-amber-400"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.completionRate}%
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Completion Rate
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Performance Trends
            </h3>
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                    <span>{item.month}</span>
                    <span>
                      Projects: {item.projects} | Grade: {item.grades}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.grades}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Activity Distribution
            </h3>
            <div className="space-y-4">
              {activityData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
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
});

AnalyticsDashboard.displayName = "AnalyticsDashboard";

export default AnalyticsDashboard;
