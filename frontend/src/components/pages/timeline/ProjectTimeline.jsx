import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectTimeline = () => {
  const navigate = useNavigate();
  const [projects] = useState([
    {
      id: 1,
      name: "Database Design",
      start: "2024-01-01",
      end: "2024-03-31",
      progress: 65,
      milestones: 6,
      team: 4,
    },
    {
      id: 2,
      name: "Web Application",
      start: "2024-02-01",
      end: "2024-04-30",
      progress: 40,
      milestones: 8,
      team: 5,
    },
    {
      id: 3,
      name: "Mobile App",
      start: "2024-01-15",
      end: "2024-04-15",
      progress: 30,
      milestones: 7,
      team: 3,
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
            <p className="text-gray-600">Overview of all project timelines</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            New Project
          </button>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Timeline Overview
          </h3>

          {/* Month Headers */}
          <div className="flex mb-4">
            <div className="w-48"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                {months.map((month, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-medium text-gray-700 w-16"
                  >
                    {month}
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

          {/* Project Bars */}
          <div className="space-y-6">
            {projects.map((project) => {
              const startMonth = new Date(project.start).getMonth();
              const endMonth = new Date(project.end).getMonth();
              const duration = endMonth - startMonth + 1;

              return (
                <div key={project.id} className="flex items-center">
                  <div className="w-48">
                    <div className="font-medium text-gray-900">
                      {project.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {project.start} - {project.end}
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    {/* Project Bar */}
                    <div className="relative h-10">
                      <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-200 transform -translate-y-1/2 rounded-full"></div>
                      <div
                        className="absolute top-1/2 h-3 bg-blue-500 transform -translate-y-1/2 rounded-full"
                        style={{
                          left: `${(startMonth / 6) * 100}%`,
                          width: `${(duration / 6) * 100}%`,
                        }}
                      >
                        <div
                          className="h-3 bg-green-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>

                      {/* Start and End Markers */}
                      <div
                        className="absolute top-1/2 w-2 h-2 bg-blue-700 rounded-full transform -translate-y-1/2"
                        style={{ left: `${(startMonth / 6) * 100}%` }}
                      ></div>
                      <div
                        className="absolute top-1/2 w-2 h-2 bg-red-700 rounded-full transform -translate-y-1/2"
                        style={{ left: `${(endMonth / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <div className="font-medium text-gray-900">
                      {project.progress}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {project.milestones} milestones
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Milestones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {project.start} to {project.end}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {project.milestones}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {project.team} members
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
