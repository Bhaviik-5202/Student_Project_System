// src/components/pages/resources/ResourceDetails.jsx
import { memo, useMemo } from "react";
import { useParams } from "react-router-dom";

const ResourceDetails = memo(() => {
  const { id } = useParams();

  const resource = useMemo(
    () => ({
      id: id || "1",
      name: "Web Development Guide.pdf",
      type: "pdf",
      size: "2.4 MB",
      category: "Documents",
      uploadedBy: "Dr. John Smith",
      uploadDate: "March 15, 2024",
      downloads: 124,
      description:
        "Comprehensive guide covering HTML5, CSS3, JavaScript, React, and modern web development practices.",
      tags: ["Web Development", "HTML", "CSS", "JavaScript", "React"],
    }),
    [id],
  );

  const relatedResources = useMemo(
    () => [
      "CSS Grid Guide.pdf",
      "JavaScript ES6 Cheatsheet.pdf",
      "React Hooks Tutorial.pdf",
    ],
    [],
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Resource Details
        </h1>
        <button className="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60">
          Delete Resource
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📄</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {resource.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-sm">
                      {resource.category}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {resource.size}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      📥 {resource.downloads} downloads
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {resource.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Upload Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-medium">Uploaded by:</span>{" "}
                      {resource.uploadedBy}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-medium">Upload date:</span>{" "}
                      {resource.uploadDate}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Permissions
                  </h3>
                  <div className="space-y-2">
                    <p className="text-slate-700 dark:text-slate-300">
                      ✅ View & Download
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      ❌ Edit & Delete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                <span>📥</span> Download Resource
              </button>
              <button className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                Share Resource
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-md p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              Preview
            </h3>
            <div className="bg-slate-50 dark:bg-slate-700 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-slate-600 dark:text-slate-300">
                  PDF Preview
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Click to view full document
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-md p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              Related Resources
            </h3>
            <div className="space-y-3">
              {relatedResources.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded"
                >
                  <span className="text-xl">📄</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">
                      {item}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PDF • 1.2 MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ResourceDetails.displayName = "ResourceDetails";

export default ResourceDetails;
