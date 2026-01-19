import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseMaterials = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materials] = useState([
    {
      id: 1,
      title: "Lecture 1: Introduction",
      type: "PDF",
      date: "Jan 10, 2024",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Assignment 1 Guidelines",
      type: "PDF",
      date: "Jan 12, 2024",
      size: "1.1 MB",
    },
    {
      id: 3,
      title: "Week 1 Slides",
      type: "PPT",
      date: "Jan 8, 2024",
      size: "5.3 MB",
    },
    {
      id: 4,
      title: "Reference Book Chapter",
      type: "PDF",
      date: "Jan 15, 2024",
      size: "8.7 MB",
    },
    {
      id: 5,
      title: "Tutorial Video",
      type: "Video",
      date: "Jan 14, 2024",
      size: "45.2 MB",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/courses")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Courses
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Course Materials</h1>
          <p className="text-gray-600">
            Access all learning materials and resources
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Software Engineering (CS401)
                </h2>
                <p className="text-gray-600">Dr. John Smith • Fall 2024</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upload Material
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {material.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          material.type === "PDF"
                            ? "bg-red-100 text-red-800"
                            : material.type === "Video"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {material.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {material.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {material.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Download
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Preview
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

export default CourseMaterials;
