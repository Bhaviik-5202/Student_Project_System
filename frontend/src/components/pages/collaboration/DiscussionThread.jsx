import React, { useState, useEffect, memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import collaborationService from "../../../services/collaborationService";
import useNotification from "../../../hooks/useNotification";

const ReplyItem = memo(({ reply }) => (
  <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
    <div className="flex items-center mb-2">
      <div className="font-medium text-slate-900 dark:text-white">
        {reply.author?.name || "Anonymous"}
      </div>
      <div className="text-slate-500 dark:text-slate-400 text-sm ml-4">
        {new Date(reply.createdAt).toLocaleString()}
      </div>
    </div>
    <p className="text-slate-700 dark:text-slate-300">{reply.content}</p>
  </div>
));

ReplyItem.displayName = "ReplyItem";

ReplyItem.propTypes = {
  reply: PropTypes.shape({
    author: PropTypes.object,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

const DiscussionThread = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const { showSuccess, showError } = useNotification();

  const fetchThread = useCallback(async () => {
    try {
      setLoading(true);
      const response = await collaborationService.getDiscussionById(id);
      if (response.success) {
        setThread(response.data);
      }
    } catch (error) {
      showError("Failed to fetch discussion details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleReplyChange = useCallback((e) => {
    setReply(e.target.value);
  }, []);

  const handlePostReply = useCallback(async () => {
    if (!reply.trim()) return;
    try {
      const response = await collaborationService.addReply(id, reply);
      if (response.success) {
        showSuccess("Reply posted successfully");
        setReply("");
        fetchThread();
      }
    } catch (error) {
      showError("Failed to post reply");
    }
  }, [id, reply, fetchThread, showSuccess, showError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading discussion...</div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Discussion not found.</p>
        <button
          onClick={() => navigate("/discussions")}
          className="text-blue-600"
        >
          Back to Discussions
        </button>
      </div>
    );
  }

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
            {thread.title}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-slate-600 dark:text-slate-400">
              By {thread.author?.name || "Anonymous"}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">
              {new Date(thread.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              {thread.content}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Replies ({thread.replies?.length || 0})
          </h2>
          <div className="space-y-6">
            {(thread.replies || []).map((replyItem, index) => (
              <ReplyItem key={index} reply={replyItem} />
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
                disabled={!reply.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
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
