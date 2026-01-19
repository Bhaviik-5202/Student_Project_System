import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Workspace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("files");

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
              <h1 className="text-2xl font-bold text-gray-900">
                Project Workspace
              </h1>
              <p className="text-gray-600">
                Database Design Project • Team Collaboration Space
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Invite Members
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["files", "tasks", "chat", "calendar", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {activeTab === "files" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Files
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "project_specs.pdf",
                    size: "2.4 MB",
                    modified: "2 hours ago",
                    type: "PDF",
                  },
                  {
                    name: "database_schema.sql",
                    size: "1.1 MB",
                    modified: "1 day ago",
                    type: "SQL",
                  },
                  {
                    name: "meeting_notes.docx",
                    size: "0.8 MB",
                    modified: "2 days ago",
                    type: "DOC",
                  },
                  {
                    name: "prototype_design.fig",
                    size: "3.2 MB",
                    modified: "3 days ago",
                    type: "FIG",
                  },
                ].map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-3 text-xl">📄</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {file.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {file.type} • {file.size} • Modified {file.modified}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">
                        Download
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Tasks
              </h3>
              <div className="space-y-3">
                {[
                  {
                    task: "Design database schema",
                    assignee: "John Doe",
                    status: "Completed",
                  },
                  {
                    task: "Create ER diagram",
                    assignee: "Jane Smith",
                    status: "In Progress",
                  },
                  {
                    task: "Set up development environment",
                    assignee: "Robert Johnson",
                    status: "Pending",
                  },
                  {
                    task: "Write project documentation",
                    assignee: "Sarah Williams",
                    status: "Pending",
                  },
                ].map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {task.task}
                      </div>
                      <div className="text-sm text-gray-600">
                        Assigned to: {task.assignee}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Team Chat
              </h3>
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p>Open team chat to start conversation</p>
                <button
                  onClick={() => navigate("/collaboration/chat")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
