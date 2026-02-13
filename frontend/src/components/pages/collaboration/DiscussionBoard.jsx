import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const DiscussionBoard = memo(() => {
  const navigate = useNavigate();
  const discussions = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Discussion Board
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Participate in discussions and ask questions
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
            New Discussion
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Discussion Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Replies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {discussions.map((discussion) => (
                  <tr
                    key={discussion.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {discussion.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                      {discussion.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          discussion.category === "Projects"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : discussion.category === "Technical"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : discussion.category === "Announcements"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {discussion.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                      {discussion.replies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                      {discussion.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                        View
                      </button>
                      <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
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
});

DiscussionBoard.displayName = "DiscussionBoard";

export default DiscussionBoard;
