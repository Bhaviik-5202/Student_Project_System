import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FeedbackDashboard = () => {
  const navigate = useNavigate();
  const [feedback] = useState([
    {
      id: 1,
      assignment: "Database Design",
      student: "John Doe",
      feedback: "Good work on the schema design",
      rating: 4,
      date: "2024-01-15",
    },
    {
      id: 2,
      assignment: "Web App Prototype",
      student: "Jane Smith",
      feedback: "Need improvement in UI design",
      rating: 3,
      date: "2024-01-14",
    },
    {
      id: 3,
      assignment: "Algorithm Analysis",
      student: "Robert Johnson",
      feedback: "Excellent algorithm explanation",
      rating: 5,
      date: "2024-01-13",
    },
    {
      id: 4,
      assignment: "Research Paper",
      student: "Sarah Williams",
      feedback: "Good research but needs more citations",
      rating: 3,
      date: "2024-01-12",
    },
  ]);

  const [stats] = useState({
    totalFeedback: 24,
    averageRating: 4.2,
    pendingReviews: 3,
    responseRate: 85,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Feedback Dashboard
            </h1>
            <p className="text-gray-600">Track and manage student feedback</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.totalFeedback}
            </div>
            <div className="text-gray-600">Total Feedback Given</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.averageRating}
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.pendingReviews}
            </div>
            <div className="text-gray-600">Pending Reviews</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.responseRate}%
            </div>
            <div className="text-gray-600">Response Rate</div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Feedback
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedback.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {item.assignment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {item.student}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 max-w-xs truncate">
                        {item.feedback}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < item.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Feedback Distribution
            </h3>
            <div className="space-y-4">
              {[
                { rating: "5 Stars", count: 12, percentage: 50 },
                { rating: "4 Stars", count: 8, percentage: 33 },
                { rating: "3 Stars", count: 3, percentage: 13 },
                { rating: "2 Stars", count: 1, percentage: 4 },
                { rating: "1 Star", count: 0, percentage: 0 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.rating}</span>
                    <span>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-left">
                Give New Feedback
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-left">
                View All Feedback
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-left">
                Export Feedback Report
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-left">
                Manage Feedback Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
