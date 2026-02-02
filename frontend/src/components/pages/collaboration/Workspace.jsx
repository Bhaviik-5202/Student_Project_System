import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const Workspace = memo(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("files");

  const files = useMemo(
    () => [
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
    ],
    []
  );

  const tasks = useMemo(
    () => [
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Project Workspace
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Database Design Project • Team Collaboration Space
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
                Invite Members
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-8">
              {["files", "tasks", "chat", "calendar", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          {activeTab === "files" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Project Files
              </h3>
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-slate-400 dark:text-slate-500 mr-3 text-xl">📄</span>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {file.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {file.type} • {file.size} • Modified {file.modified}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                        Download
                      </button>
                      <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Project Tasks
              </h3>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {task.task}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Assigned to: {task.assignee}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        task.status === "Completed"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                          : task.status === "In Progress"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Team Chat
              </h3>
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <div className="text-4xl mb-4">💬</div>
                <p>Open team chat to start conversation</p>
                <button
                  onClick={() => navigate("/collaboration/chat")}
                  className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
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
});

Workspace.displayName = "Workspace";

export default Workspace;
