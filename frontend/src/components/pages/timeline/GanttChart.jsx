import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GanttChart = () => {
  const navigate = useNavigate();
  const [projects] = useState([
    {
      id: 1,
      name: "E-Commerce Platform",
      start: "2024-01-01",
      end: "2024-03-31",
      progress: 65,
      milestones: [
        { name: "Planning", date: "2024-01-15", status: "completed" },
        { name: "Design", date: "2024-02-15", status: "completed" },
        { name: "Development", date: "2024-03-15", status: "in-progress" },
        { name: "Testing", date: "2024-03-25", status: "pending" },
        { name: "Deployment", date: "2024-03-31", status: "pending" },
      ],
    },
    {
      id: 2,
      name: "Mobile App",
      start: "2024-02-01",
      end: "2024-04-30",
      progress: 40,
      milestones: [
        { name: "Planning", date: "2024-02-15", status: "completed" },
        { name: "Design", date: "2024-03-01", status: "in-progress" },
        { name: "Development", date: "2024-04-01", status: "pending" },
        { name: "Testing", date: "2024-04-20", status: "pending" },
      ],
    },
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Project Timeline
            </h1>
            <p className="text-gray-600">
              Visualize project schedules and milestones
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Project
          </button>
        </div>

        {/* Timeline Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex">
            <div className="w-48"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                {months.map((month, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-medium text-gray-700"
                  >
                    {month} 2024
                  </div>
                ))}
              </div>
              <div className="flex">
                {Array.from({ length: 180 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 border-r border-gray-300 w-1"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Timeline */}
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-48">
                  <h3 className="font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {project.start} - {project.end}
                  </p>
                </div>
                <div className="flex-1 relative">
                  {/* Timeline Bar */}
                  <div className="relative h-10">
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 transform -translate-y-1/2 rounded-full"></div>
                    <div
                      className="absolute top-1/2 left-0 h-2 bg-blue-500 transform -translate-y-1/2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>

                    {/* Milestone Markers */}
                    {project.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className="absolute top-1/2 transform -translate-y-1/2"
                        style={{
                          left: `${
                            (idx + 1) * (100 / (project.milestones.length + 1))
                          }%`,
                        }}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : milestone.status === "in-progress"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <div className="text-xs text-gray-600 mt-1 text-center">
                          {milestone.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-32 text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Milestones List */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Milestones
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {project.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {milestone.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : milestone.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Due: {milestone.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
