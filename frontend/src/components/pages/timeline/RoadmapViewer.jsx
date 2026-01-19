import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoadmapViewer = () => {
  const navigate = useNavigate();
  const [roadmap] = useState({
    title: "Software Engineering Roadmap",
    description: "Complete learning path for software engineering students",
    phases: [
      {
        id: 1,
        name: "Foundation",
        quarter: "Q1 2024",
        objectives: [
          "Learn programming fundamentals",
          "Understand basic algorithms",
          "Master version control with Git",
        ],
        status: "completed",
      },
      {
        id: 2,
        name: "Web Development",
        quarter: "Q2 2024",
        objectives: [
          "Learn HTML, CSS, JavaScript",
          "Master React framework",
          "Build responsive web applications",
        ],
        status: "in-progress",
      },
      {
        id: 3,
        name: "Backend Development",
        quarter: "Q3 2024",
        objectives: [
          "Learn Node.js and Express",
          "Understand databases (SQL & NoSQL)",
          "Build RESTful APIs",
        ],
        status: "upcoming",
      },
      {
        id: 4,
        name: "Advanced Topics",
        quarter: "Q4 2024",
        objectives: [
          "Learn cloud computing",
          "Understand DevOps practices",
          "Study system design",
        ],
        status: "upcoming",
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {roadmap.title}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {roadmap.description}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-8 h-1 bg-gray-300"></div>

            {/* Phases */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {roadmap.phases.map((phase, index) => (
                <div key={phase.id} className="relative">
                  {/* Phase Indicator */}
                  <div
                    className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white z-10 ${
                      phase.status === "completed"
                        ? "bg-green-500"
                        : phase.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  {/* Phase Card */}
                  <div
                    className={`mt-8 p-6 border rounded-lg ${
                      phase.status === "completed"
                        ? "border-green-200 bg-green-50"
                        : phase.status === "in-progress"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {phase.name}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {phase.quarter}
                        </span>
                      </div>
                      <div
                        className={`text-sm font-medium mt-2 ${
                          phase.status === "completed"
                            ? "text-green-700"
                            : phase.status === "in-progress"
                            ? "text-yellow-700"
                            : "text-gray-700"
                        }`}
                      >
                        {phase.status.replace("-", " ").toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-900">
                        Objectives:
                      </div>
                      <ul className="space-y-2">
                        {phase.objectives.map((objective, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-sm text-gray-700"
                          >
                            <span
                              className={`mr-2 mt-1 ${
                                phase.status === "completed"
                                  ? "text-green-500"
                                  : phase.status === "in-progress" && idx < 2
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {phase.status === "completed" ||
                              (phase.status === "in-progress" && idx < 2)
                                ? "✓"
                                : "○"}
                            </span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapViewer;
