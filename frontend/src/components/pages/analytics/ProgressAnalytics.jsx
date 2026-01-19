import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProgressAnalytics = () => {
  const navigate = useNavigate();
  const [projects] = useState([
    {
      id: 1,
      name: "E-Commerce Platform",
      progress: 85,
      timeline: "On Track",
      teamSize: 4,
    },
    {
      id: 2,
      name: "Mobile App",
      progress: 65,
      timeline: "Slightly Behind",
      teamSize: 3,
    },
    {
      id: 3,
      name: "Inventory System",
      progress: 92,
      timeline: "Ahead",
      teamSize: 5,
    },
    {
      id: 4,
      name: "Data Analytics Dashboard",
      progress: 45,
      timeline: "Behind Schedule",
      teamSize: 4,
    },
    {
      id: 5,
      name: "CMS Development",
      progress: 78,
      timeline: "On Track",
      teamSize: 3,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Progress Analytics
            </h1>
            <p className="text-gray-600">
              Monitor project progress and completion rates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress Summary
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Average Progress
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-gray-900 mr-3">
                      {Math.round(
                        projects.reduce((sum, p) => sum + p.progress, 0) /
                          projects.length
                      )}
                      %
                    </div>
                    <div className="text-sm text-green-600 flex items-center">
                      <span>↑ 5.2%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Projects by Status
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        label: "On Track",
                        count: projects.filter((p) => p.timeline === "On Track")
                          .length,
                        color: "bg-green-500",
                      },
                      {
                        label: "Slightly Behind",
                        count: projects.filter(
                          (p) => p.timeline === "Slightly Behind"
                        ).length,
                        color: "bg-yellow-500",
                      },
                      {
                        label: "Behind Schedule",
                        count: projects.filter(
                          (p) => p.timeline === "Behind Schedule"
                        ).length,
                        color: "bg-red-500",
                      },
                      {
                        label: "Ahead",
                        count: projects.filter((p) => p.timeline === "Ahead")
                          .length,
                        color: "bg-blue-500",
                      },
                    ].map((status, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${status.color} mr-2`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {status.label}
                          </span>
                        </div>
                        <span className="font-medium">{status.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Progress Details
              </h3>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Team Size: {project.teamSize} members
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.timeline === "On Track"
                            ? "bg-green-100 text-green-800"
                            : project.timeline === "Ahead"
                            ? "bg-blue-100 text-blue-800"
                            : project.timeline === "Slightly Behind"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {project.timeline}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            project.progress >= 80
                              ? "bg-green-500"
                              : project.progress >= 60
                              ? "bg-blue-500"
                              : project.progress >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View Details
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-800">
                        View Team
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
