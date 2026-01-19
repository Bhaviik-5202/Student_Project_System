import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MilestoneTracker = () => {
  const navigate = useNavigate();
  const [project] = useState({
    name: "Database Design Project",
    milestones: [
      {
        id: 1,
        name: "Project Proposal",
        dueDate: "2024-01-10",
        status: "completed",
        progress: 100,
      },
      {
        id: 2,
        name: "Requirements Gathering",
        dueDate: "2024-01-20",
        status: "in-progress",
        progress: 75,
      },
      {
        id: 3,
        name: "Database Design",
        dueDate: "2024-02-01",
        status: "pending",
        progress: 25,
      },
      {
        id: 4,
        name: "Implementation",
        dueDate: "2024-02-15",
        status: "pending",
        progress: 0,
      },
      {
        id: 5,
        name: "Testing",
        dueDate: "2024-02-28",
        status: "pending",
        progress: 0,
      },
      {
        id: 6,
        name: "Final Submission",
        dueDate: "2024-03-15",
        status: "pending",
        progress: 0,
      },
    ],
  });

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
                Milestone Tracker
              </h1>
              <p className="text-gray-600">{project.name}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Milestone
            </button>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {/* Milestones */}
            <div className="space-y-8">
              {project.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-6 top-2 w-4 h-4 rounded-full border-4 border-white ${
                      milestone.status === "completed"
                        ? "bg-green-500"
                        : milestone.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  {/* Milestone Card */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {milestone.name}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          Due: {milestone.dueDate}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          milestone.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : milestone.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {milestone.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            milestone.progress === 100
                              ? "bg-green-500"
                              : milestone.progress >= 50
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">
                        View Details
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {
                project.milestones.filter((m) => m.status === "completed")
                  .length
              }
            </div>
            <div className="text-gray-600">Completed Milestones</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {
                project.milestones.filter((m) => m.status === "in-progress")
                  .length
              }
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {project.milestones.filter((m) => m.status === "pending").length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
