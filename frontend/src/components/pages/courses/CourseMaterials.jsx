import React, { memo, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseMaterials = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const materials = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/courses")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Courses
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Course Materials
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Access all learning materials and resources
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Software Engineering (CS401)
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Dr. John Smith • Fall 2024
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Upload Material
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
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
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {materials.map((material) => (
                  <tr
                    key={material.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {material.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          material.type === "PDF"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
                            : material.type === "Video"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {material.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-200">
                      {material.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-200">
                      {material.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        Download
                      </button>
                      <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300">
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
});

CourseMaterials.displayName = "CourseMaterials";

export default CourseMaterials;
