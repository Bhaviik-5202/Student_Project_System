import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import analyticsService from "../../../services/analyticsService";

/**
 * AnalyticsDashboard Component
 * 
 * A comprehensive performance intelligence center. Aggregates and 
 * visualizes student progress, project completion rates, and 
 * longitudinal performance metrics using interactive data tables 
 * and color-coded activity breakdowns.
 */
const AnalyticsDashboard = memo(() => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data?.stats || {});
        setPerformanceData(data?.performanceData || []);
        setActivityData(data?.activityData || []);
      } catch (err) {
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

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

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            Loading analytics...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Total Students */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-user-graduate text-xl text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.totalStudents || 0}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Total Students
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Projects */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-tasks text-xl text-green-600 dark:text-green-400"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.activeProjects || 0}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Active Projects
                    </div>
                  </div>
                </div>
              </div>

              {/* Avg Grade */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-chart-line text-xl text-yellow-600 dark:text-yellow-400"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.avgGrade || 0}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Average Grade
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-percentage text-xl text-purple-600 dark:text-purple-400"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.completionRate || 0}%
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Completion Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Project Performance Over Time
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Projects
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Avg. Grade
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {performanceData.map((row, index) => (
                      <tr key={row.month || index}>
                        <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">
                          {row.month}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                          {row.projects}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                          {row.grades}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Activity Breakdown
              </h3>

              <div className="flex flex-wrap gap-4">
                {activityData.map((activity, index) => (
                  <div
                    key={activity.label || index}
                    className={`flex flex-col items-center p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 ${activity.color}`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {activity.value}%
                    </span>
                    <span className="text-white text-sm font-medium">
                      {activity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

AnalyticsDashboard.displayName = "AnalyticsDashboard";

export default AnalyticsDashboard;
