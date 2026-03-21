import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import collaborationService from "../../../services/collaborationService";
import projectService from "../../../services/projectService";
import assignmentService from "../../../services/assignmentService";
import useNotification from "../../../hooks/useNotification";

const Workspace = memo(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("files");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [files, setFiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await projectService.getAllProjects();
      if (response.data?.success) {
        setProjects(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedProjectId(response.data.data[0]._id || response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  }, []);

  const fetchWorkspaceData = useCallback(async (projectId) => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [filesRes, tasksRes] = await Promise.all([
        collaborationService.getSharedFiles(projectId),
        assignmentService.getAll()
      ]);
      
      if (filesRes.success) {
        setFiles(filesRes.data);
      }
      
      // For tasks, we use assignments. Since they are linked to courses, 
      // in a real app we'd filter by the course linked to the project.
      if (tasksRes.data?.success) {
        setTasks(tasksRes.data.data);
      }
    } catch (error) {
      showError("Failed to fetch workspace data");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchWorkspaceData(selectedProjectId);
    }
  }, [selectedProjectId, fetchWorkspaceData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/discussions")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Collaboration
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Project Workspace
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {projects.map((p) => (
                    <option key={p.id || p._id} value={p.id || p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
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
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-4 text-slate-500">Loading files...</div>
                ) : files.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No files found.</div>
                ) : (
                  files.map((file, index) => (
                    <div
                      key={file.id || file._id || index}
                      className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <span className="text-slate-400 dark:text-slate-500 mr-3 text-xl">
                          📄
                        </span>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {file.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {file.type || "FILE"} • {file.size || "Unknown"} • Modified {file.modified || new Date(file.updatedAt || Date.now()).toLocaleDateString()}
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
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Project Tasks
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-4 text-slate-500">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No tasks found.</div>
                ) : (
                  tasks.map((task, index) => (
                    <div
                      key={task.id || task._id || index}
                      className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {task.task || task.title}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Assigned to: {task.assignee || (task.assigneeId ? task.assigneeId.name : "Unassigned")}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          (task.status || "Pending") === "Completed"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                            : (task.status || "Pending") === "In Progress"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {task.status || "Pending"}
                      </span>
                    </div>
                  ))
                )}
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
