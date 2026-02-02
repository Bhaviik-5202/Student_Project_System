import React, { useState, memo, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

const ReplyItem = memo(({ reply }) => (
  <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
    <div className="flex items-center mb-2">
      <div className="font-medium text-slate-900 dark:text-white">
        {reply.author}
      </div>
      <div className="text-slate-500 dark:text-slate-400 text-sm ml-4">
        {reply.createdAt}
      </div>
    </div>
    <p className="text-slate-700 dark:text-slate-300">{reply.content}</p>
  </div>
));

ReplyItem.displayName = "ReplyItem";

ReplyItem.propTypes = {
  reply: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

const DiscussionThread = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reply, setReply] = useState("");

  const threadData = useMemo(
    () => ({
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
    }),
    []
  );

  const handleReplyChange = useCallback((e) => {
    setReply(e.target.value);
  }, []);

  const handlePostReply = useCallback(() => {
    if (reply.trim()) {
      setReply("");
    }
  }, [reply]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/discussions")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4 font-medium"
          >
            ← Back to Discussions
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {threadData.title}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-slate-600 dark:text-slate-400">
              By {threadData.author}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">
              {threadData.createdAt}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              {threadData.content}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Replies ({threadData.replies.length})
          </h2>
          <div className="space-y-6">
            {threadData.replies.map((replyItem) => (
              <ReplyItem key={replyItem.id} reply={replyItem} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Add Reply
          </h3>
          <div className="space-y-4">
            <textarea
              rows="4"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 placeholder-slate-500 dark:placeholder-slate-400"
              value={reply}
              onChange={handleReplyChange}
              placeholder="Type your reply here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handlePostReply}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DiscussionThread.displayName = "DiscussionThread";

export default DiscussionThread;
