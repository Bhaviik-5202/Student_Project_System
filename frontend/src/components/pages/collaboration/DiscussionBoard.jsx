import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DiscussionBoard = () => {
  const navigate = useNavigate();
  const [discussions] = useState([
    {
      id: 1,
      title: "Project Proposal Questions",
      author: "Student A",
      replies: 12,
      lastActivity: "2 hours ago",
      category: "Projects",
    },
    {
      id: 2,
      title: "Database Design Help",
      author: "Student B",
      replies: 5,
      lastActivity: "5 hours ago",
      category: "Technical",
    },
    {
      id: 3,
      title: "Meeting Schedule Updates",
      author: "Dr. Smith",
      replies: 8,
      lastActivity: "1 day ago",
      category: "Announcements",
    },
    {
      id: 4,
      title: "Web Development Resources",
      author: "Student C",
      replies: 3,
      lastActivity: "2 days ago",
      category: "Resources",
    },
    {
      id: 5,
      title: "Grading Policy Clarification",
      author: "Student D",
      replies: 15,
      lastActivity: "3 days ago",
      category: "General",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Discussion Board
            </h1>
            <p className="text-gray-600">
              Participate in discussions and ask questions
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            New Discussion
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discussion Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Replies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discussions.map((discussion) => (
                  <tr key={discussion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {discussion.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {discussion.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          discussion.category === "Projects"
                            ? "bg-blue-100 text-blue-800"
                            : discussion.category === "Technical"
                            ? "bg-green-100 text-green-800"
                            : discussion.category === "Announcements"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {discussion.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {discussion.replies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {discussion.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionBoard;
