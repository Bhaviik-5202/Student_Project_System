import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatWindow = () => {
  const navigate = useNavigate();
  const [messages] = useState([
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
  ]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/collaboration")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Collaboration
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Chat</h1>
              <p className="text-gray-600">Database Design Project Team</p>
            </div>
            <div className="flex gap-3">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                Add Members
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Members List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Team Members
              </h3>
              <div className="space-y-3">
                {[
                  { name: "John Doe", role: "Team Lead", online: true },
                  { name: "Jane Smith", role: "Developer", online: true },
                  { name: "Robert Johnson", role: "Designer", online: false },
                  { name: "Sarah Williams", role: "Tester", online: true },
                  { name: "You", role: "Developer", online: true },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          member.online ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? "justify-end" : ""}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.isMe ? "bg-blue-100" : "bg-gray-100"
                      } rounded-lg p-4`}
                    >
                      {!message.isMe && (
                        <div className="font-medium text-gray-900 mb-1">
                          {message.sender}
                        </div>
                      )}
                      <div className="text-gray-700">{message.text}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
};

export default ChatWindow;
