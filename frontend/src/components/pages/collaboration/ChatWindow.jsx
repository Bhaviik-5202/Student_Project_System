import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const ChatWindow = memo(() => {
  const navigate = useNavigate();
  const messages = useMemo(
    () => [
      {
        id: 1,
        sender: "John Doe",
        text: "Has everyone completed their parts?",
        time: "10:30 AM",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        text: "I just submitted my section",
        time: "10:32 AM",
        isMe: true,
      },
      {
        id: 3,
        sender: "Jane Smith",
        text: "Working on it, will finish by EOD",
        time: "10:35 AM",
        isMe: false,
      },
      {
        id: 4,
        sender: "Robert Johnson",
        text: "Do we have a meeting scheduled?",
        time: "10:40 AM",
        isMe: false,
      },
    ],
    []
  );
  const [newMessage, setNewMessage] = useState("");

  const members = useMemo(
    () => [
      { name: "John Doe", role: "Team Lead", online: true },
      { name: "Jane Smith", role: "Developer", online: true },
      { name: "Robert Johnson", role: "Designer", online: false },
      { name: "Sarah Williams", role: "Tester", online: true },
      { name: "You", role: "Developer", online: true },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/collaboration")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Collaboration
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Chat</h1>
              <p className="text-slate-600 dark:text-slate-400">Database Design Project Team</p>
            </div>
            <div className="flex gap-3">
              <button className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
                Add Members
              </button>
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
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
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
                      <div className="text-sm text-slate-600 dark:text-slate-400">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? "justify-end" : ""}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.isMe
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-slate-100 dark:bg-slate-700"
                      } rounded-lg p-4`}
                    >
                      {!message.isMe && (
                        <div className="font-medium text-slate-900 dark:text-white mb-1">
                          {message.sender}
                        </div>
                      )}
                      <div className="text-slate-700 dark:text-slate-200">{message.text}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                  />
                  <button className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
                    Send
                  </button>
                </div>
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
