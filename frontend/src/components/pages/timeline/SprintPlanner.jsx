import { useCallback, useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const SprintPlanner = memo(() => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await api.get('/timeline/sprints');
        const data = response.data || [];
        setSprints(data);
      } catch (error) {
        console.error("Failed to fetch sprints", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSprints();
  }, []);

  const [activeSprint, setActiveSprint] = useState(3);

  const activeSprintData = useMemo(
    () => sprints.find((s) => s.id === activeSprint),
    [sprints, activeSprint],
  );

  const sprintStatusStyles = {
    completed:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    "in-progress":
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    planned:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };

  const taskStatusStyles = {
    completed:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    "in-progress":
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    todo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };

  const [sprintTasks, setSprintTasks] = useState([]);

  useEffect(() => {
    if (!activeSprintData) return;
    const fetchSprintTasks = async () => {
      try {
        const response = await api.get(`/timeline/sprints/${activeSprintData.id}/tasks`);
        const data = response.data || [];
        setSprintTasks(data);
      } catch (error) {
        console.error("Failed to fetch sprint tasks", error);
      }
    };
    fetchSprintTasks();
  }, [activeSprintData]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 flex items-center mb-4"
          >
            ← Back to Timeline
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Sprint Planner
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Database Design Project • Agile Development
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              New Sprint
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading sprints...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sprint List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Sprints
              </h3>
              <div className="space-y-4">
                {sprints.map((sprint) => (
                  <button
                    key={sprint.id}
                    onClick={() => setActiveSprint(sprint.id)}
                    className={`w-full p-4 text-left rounded-lg transition-colors ${
                      activeSprint === sprint.id
                        ? "bg-blue-50 border-blue-200 border dark:bg-blue-950/40 dark:border-blue-900/50"
                        : "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      {sprint.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {sprint.start} - {sprint.end}
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mt-2">
                      <span>Velocity: {sprint.velocity}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          sprintStatusStyles[sprint.status]
                        }`}
                      >
                        {sprint.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Sprint Details */}
          <div className="lg:col-span-2">
            {activeSprintData && (
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {activeSprintData.name}
                    </h3>
                    <div className="text-slate-600 dark:text-slate-300 mt-1">
                      {activeSprintData.start} to {activeSprintData.end}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sprintStatusStyles[activeSprintData.status]
                    }`}
                  >
                    {activeSprintData.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                {/* Sprint Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                      Velocity
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {activeSprintData.velocity}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                      Completed
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {activeSprintData.completed}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                      Remaining
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {activeSprintData.velocity - activeSprintData.completed}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                      Tasks
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {activeSprintData.tasks}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
                    <span>Sprint Progress</span>
                    <span>
                      {activeSprintData.completed} / {activeSprintData.velocity}{" "}
                      points (
                      {Math.round(
                        (activeSprintData.completed /
                          activeSprintData.velocity) *
                          100,
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        activeSprintData.completed >= activeSprintData.velocity
                          ? "bg-emerald-500"
                          : activeSprintData.completed /
                                activeSprintData.velocity >=
                              0.7
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                      style={{
                        width: `${
                          (activeSprintData.completed /
                            activeSprintData.velocity) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Sprint Tasks
                  </h4>
                  <div className="space-y-3">
                    {sprintTasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {task.task}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            Assigned to: {task.assignee}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-sm rounded">
                            {task.points} points
                          </span>
                          <span
                            className={`px-2 py-1 text-sm rounded ${
                              taskStatusStyles[task.status]
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
});

SprintPlanner.displayName = "SprintPlanner";

export default SprintPlanner;
