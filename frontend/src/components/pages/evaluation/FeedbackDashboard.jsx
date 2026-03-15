import React, { memo, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const FeedbackDashboard = memo(() => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0.0,
    pendingReviews: 0,
    responseRate: 0,
  });
  const [distribution, setDistribution] = useState([
    { rating: "5 Stars", count: 0, percentage: 0 },
    { rating: "4 Stars", count: 0, percentage: 0 },
    { rating: "3 Stars", count: 0, percentage: 0 },
    { rating: "2 Stars", count: 0, percentage: 0 },
    { rating: "1 Star", count: 0, percentage: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/evaluations/dashboard/feedback");
        if (res.success) {
          const data = res.data || {};
          if (data.feedback) setFeedback(data.feedback);
          if (data.stats) setStats(data.stats);
          if (data.distribution) setDistribution(data.distribution);
        }
      } catch (error) {
        console.error("Failed to fetch feedback dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Feedback Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track and manage student feedback
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.totalFeedback}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Total Feedback Given
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.averageRating}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Average Rating
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.pendingReviews}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Pending Reviews
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.responseRate}%
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Response Rate
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Feedback
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-slate-500">Loading feedback...</td>
                  </tr>
                ) : feedback.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-slate-500">No feedback available.</td>
                  </tr>
                ) : (
                  feedback.map((item) => (
                    <tr
                      key={item.id || item._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {item.assignment || (item.assignmentId ? item.assignmentId.title : "TBA")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {item.student || (item.studentId ? item.studentId.name : "TBA")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 dark:text-slate-300 max-w-xs truncate">
                          {item.feedback || item.comments || "No comments"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < (item.rating || item.score || 0)
                                  ? "text-amber-400 dark:text-amber-300"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {item.date || new Date(item.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          View
                        </button>
                        <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Feedback Distribution
            </h3>
            <div className="space-y-4">
              {distribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                    <span>{item.rating}</span>
                    <span>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-left">
                Give New Feedback
              </button>
              <button className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
                View All Feedback
              </button>
              <button className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
                Export Feedback Report
              </button>
              <button className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
                Manage Feedback Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FeedbackDashboard.displayName = "FeedbackDashboard";

export default FeedbackDashboard;
