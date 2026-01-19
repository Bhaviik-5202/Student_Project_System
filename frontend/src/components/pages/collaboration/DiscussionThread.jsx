import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DiscussionThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread] = useState({
    title: "Database Design Help",
    author: "John Doe",
    createdAt: "2024-01-15 10:30:00",
    content:
      "I need help with designing the database schema for our project. Specifically, how should we handle the user authentication and session management?",
    replies: [
      {
        id: 1,
        author: "Dr. Smith",
        content:
          "Consider using JWT tokens for authentication and Redis for session management.",
        createdAt: "2024-01-15 11:00:00",
      },
      {
        id: 2,
        author: "Jane Smith",
        content:
          "We used MongoDB with Mongoose for our last project and it worked well.",
        createdAt: "2024-01-15 12:30:00",
      },
      {
        id: 3,
        author: "Robert Johnson",
        content: "Make sure to implement proper password hashing and salting.",
        createdAt: "2024-01-15 14:15:00",
      },
    ],
  });
  const [reply, setReply] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/discussions")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Discussions
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-gray-600">By {thread.author}</span>
            <span className="text-gray-500 text-sm">{thread.createdAt}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="prose max-w-none">
            <p className="text-gray-700">{thread.content}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Replies ({thread.replies.length})
          </h2>
          <div className="space-y-6">
            {thread.replies.map((reply) => (
              <div key={reply.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center mb-2">
                  <div className="font-medium text-gray-900">
                    {reply.author}
                  </div>
                  <div className="text-gray-500 text-sm ml-4">
                    {reply.createdAt}
                  </div>
                </div>
                <p className="text-gray-700">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Reply
          </h3>
          <div className="space-y-4">
            <textarea
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
            />
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionThread;
