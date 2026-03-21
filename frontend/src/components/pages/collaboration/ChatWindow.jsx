import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import chatService from "../../../services/chatService";
import { useAuth } from "../../../hooks/useAuth";
import useNotification from "../../../hooks/useNotification";

const ChatWindow = memo(() => {
  const navigate = useNavigate();
  const { id: chatId } = useParams();
  const { user: currentUser } = useAuth();
  const { showError } = useNotification();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchChatData = useCallback(async () => {
    if (!chatId) return;
    try {
      setLoading(true);
      const [chatResp, messagesResp] = await Promise.all([
        chatService.getChatById(chatId),
        chatService.getMessages(chatId)
      ]);

      if (chatResp.success) {
        setChat(chatResp.data);
      }
      if (messagesResp.success) {
        setMessages(messagesResp.data);
      }
    } catch (error) {
      showError("Failed to load chat data");
    } finally {
      setLoading(false);
    }
  }, [chatId, showError]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      const response = await chatService.sendMessage(chatId, newMessage);
      if (response.success) {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
      }
    } catch (error) {
      showError("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/chat")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Chats
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {chat?.name || (loading ? "Loading..." : "Team Chat")}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {chat?.isGroup ? "Group Chat" : "Direct Message"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Members List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Team Members
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4 text-slate-500">Loading...</div>
                ) : chat?.members?.map((member, index) => (
                  <div
                    key={member._id || index}
                    className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                        {(member.name || "U").charAt(0)}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
                          member.online ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {member.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {member.user?.role || "Member"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="h-[450px] overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.length === 0 && !loading ? (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe = (message.sender?._id || message.sender) === (currentUser?._id || currentUser?.id);
                    return (
                      <div
                        key={message._id || message.id}
                        className={`flex ${isMe ? "justify-end" : ""}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            isMe
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-slate-100 dark:bg-slate-700"
                          } rounded-lg p-4`}
                        >
                          {!isMe && (
                            <div className="font-medium text-slate-900 dark:text-white mb-1">
                              {message.sender?.name || "Unknown"}
                            </div>
                          )}
                          <div className="text-slate-700 dark:text-slate-200 break-words whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={loading ? "Loading..." : "Type your message here..."}
                    disabled={loading}
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || loading}
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatWindow.displayName = "ChatWindow";

export default ChatWindow;
