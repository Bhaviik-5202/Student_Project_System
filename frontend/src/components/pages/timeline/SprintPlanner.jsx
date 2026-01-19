import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SprintPlanner = () => {
  const navigate = useNavigate();
  const [sprints] = useState([
    {
      id: 1,
      name: "Sprint 1: Foundation",
      start: "2024-01-01",
      end: "2024-01-14",
      velocity: 32,
      completed: 28,
      status: "completed",
      tasks: 12,
    },
    {
      id: 2,
      name: "Sprint 2: Development",
      start: "2024-01-15",
      end: "2024-01-28",
      velocity: 40,
      completed: 35,
      status: "completed",
      tasks: 15,
    },
    {
      id: 3,
      name: "Sprint 3: Refinement",
      start: "2024-01-29",
      end: "2024-02-11",
      velocity: 45,
      completed: 30,
      status: "in-progress",
      tasks: 18,
    },
    {
      id: 4,
      name: "Sprint 4: Finalization",
      start: "2024-02-12",
      end: "2024-02-25",
      velocity: 50,
      completed: 0,
      status: "planned",
      tasks: 20,
    },
  ]);

  const [activeSprint, setActiveSprint] = useState(3);

  const activeSprintData = sprints.find((s) => s.id === activeSprint);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/timeline")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Timeline
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sprint Planner
              </h1>
              <p className="text-gray-600">
                Database Design Project • Agile Development
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              New Sprint
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sprint List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sprints
              </h3>
              <div className="space-y-4">
                {sprints.map((sprint) => (
                  <button
                    key={sprint.id}
                    onClick={() => setActiveSprint(sprint.id)}
                    className={`w-full p-4 text-left rounded-lg transition-colors ${
                      activeSprint === sprint.id
                        ? "bg-blue-50 border-blue-200 border"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-2">
                      {sprint.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {sprint.start} - {sprint.end}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Velocity: {sprint.velocity}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          sprint.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : sprint.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
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
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {activeSprintData.name}
                    </h3>
                    <div className="text-gray-600 mt-1">
                      {activeSprintData.start} to {activeSprintData.end}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeSprintData.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : activeSprintData.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activeSprintData.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                {/* Sprint Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Velocity</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {activeSprintData.velocity}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Completed</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {activeSprintData.completed}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Remaining</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {activeSprintData.velocity - activeSprintData.completed}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Tasks</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {activeSprintData.tasks}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Sprint Progress</span>
                    <span>
                      {activeSprintData.completed} / {activeSprintData.velocity}{" "}
                      points (
                      {Math.round(
                        (activeSprintData.completed /
                          activeSprintData.velocity) *
                          100
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        activeSprintData.completed >= activeSprintData.velocity
                          ? "bg-green-500"
                          : activeSprintData.completed /
                              activeSprintData.velocity >=
                            0.7
                          ? "bg-yellow-500"
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
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Sprint Tasks
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        task: "Design database schema",
                        assignee: "John Doe",
                        points: 8,
                        status: "completed",
                      },
                      {
                        task: "Create ER diagram",
                        assignee: "Jane Smith",
                        points: 5,
                        status: "completed",
                      },
                      {
                        task: "Implement user authentication",
                        assignee: "Robert Johnson",
                        points: 13,
                        status: "in-progress",
                      },
                      {
                        task: "Write API documentation",
                        assignee: "Sarah Williams",
                        points: 8,
                        status: "todo",
                      },
                      {
                        task: "Set up testing environment",
                        assignee: "Michael Brown",
                        points: 6,
                        status: "todo",
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
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                            {task.points} points
                          </span>
                          <span
                            className={`px-2 py-1 text-sm rounded ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : task.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
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
      </div>
    </div>
  );
};

export default SprintPlanner;
