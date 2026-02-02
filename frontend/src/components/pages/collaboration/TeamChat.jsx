// src/components/pages/collaboration/TeamChat.jsx
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";

const TeamChat = memo(() => {
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      user: "Alex Johnson",
      text: "Has everyone completed their parts?",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      user: "You",
      text: "I have finished the frontend components",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      user: "Sarah Miller",
      text: "Backend API is ready for integration",
      time: "10:35 AM",
      isMe: false,
    },
    {
      id: 4,
      user: "Mike Chen",
      text: "Database schema has been updated",
      time: "10:40 AM",
      isMe: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const teamMembers = useMemo(
    () => [
      { name: "Alex Johnson", role: "Team Lead", online: true },
      { name: "Sarah Miller", role: "Backend Developer", online: true },
      { name: "Mike Chen", role: "Database Admin", online: true },
      { name: "Emma Wilson", role: "UI/UX Designer", online: false },
    ],
    []
  );

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        user: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  }, [messages, newMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Chat</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Project: E-commerce Platform Development
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            <i className="fas fa-circle text-emerald-500 mr-1"></i>3 Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Team Members Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Team Members</h3>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        member.online ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <i className="fas fa-comment"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900 dark:text-white">Group Chat</h3>
                <div className="flex items-center space-x-4">
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                    <i className="fas fa-video"></i>
                  </button>
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                      message.isMe
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-br-none"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {!message.isMe && (
                      <div className="font-medium text-sm mb-1">
                        {message.user}
                      </div>
                    )}
                    <p>{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.isMe
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-4">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-3"
              >
                <button
                  type="button"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <i className="fas fa-paperclip"></i>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TeamChat.displayName = "TeamChat";

export default TeamChat;
