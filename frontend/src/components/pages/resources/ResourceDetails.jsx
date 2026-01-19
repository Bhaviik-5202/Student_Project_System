// src/components/pages/resources/ResourceDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

const ResourceDetails = () => {
  const { id } = useParams();

  const resource = {
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
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resource Details</h1>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
          Delete Resource
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📄</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {resource.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {resource.category}
                    </span>
                    <span className="text-gray-600">{resource.size}</span>
                    <span className="text-gray-600">
                      📥 {resource.downloads} downloads
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-700">{resource.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Upload Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Uploaded by:</span>{" "}
                      {resource.uploadedBy}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Upload date:</span>{" "}
                      {resource.uploadDate}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Permissions
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">✅ View & Download</p>
                    <p className="text-gray-700">❌ Edit & Delete</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <span>📥</span> Download Resource
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Share Resource
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-gray-600">PDF Preview</p>
                <p className="text-sm text-gray-500">
                  Click to view full document
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Related Resources
            </h3>
            <div className="space-y-3">
              {[
                "CSS Grid Guide.pdf",
                "JavaScript ES6 Cheatsheet.pdf",
                "React Hooks Tutorial.pdf",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-xl">📄</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item}</p>
                    <p className="text-xs text-gray-500">PDF • 1.2 MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
