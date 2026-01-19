// src/components/pages/resources/ResourceBrowser.jsx
import React, { useState } from "react";

const ResourceBrowser = () => {
  const [resources] = useState([
    {
      id: 1,
      name: "Web Development Guide.pdf",
      type: "pdf",
      size: "2.4 MB",
      category: "Documents",
      date: "2024-03-15",
    },
    {
      id: 2,
      name: "Database Design.pptx",
      type: "ppt",
      size: "5.1 MB",
      category: "Presentations",
      date: "2024-03-10",
    },
    {
      id: 3,
      name: "Project Template.zip",
      type: "zip",
      size: "12.3 MB",
      category: "Templates",
      date: "2024-03-05",
    },
    {
      id: 4,
      name: "API Documentation.pdf",
      type: "pdf",
      size: "3.2 MB",
      category: "Documents",
      date: "2024-02-28",
    },
    {
      id: 5,
      name: "UI Design Mockups.fig",
      type: "fig",
      size: "8.7 MB",
      category: "Design",
      date: "2024-02-25",
    },
    {
      id: 6,
      name: "Video Tutorial.mp4",
      type: "video",
      size: "45.2 MB",
      category: "Videos",
      date: "2024-02-20",
    },
  ]);

  const categories = [
    "All",
    "Documents",
    "Presentations",
    "Templates",
    "Design",
    "Videos",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getIcon = (type) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "ppt":
        return "📊";
      case "zip":
        return "📦";
      case "fig":
        return "🎨";
      case "video":
        return "🎥";
      default:
        return "📁";
    }
  };

  const filteredResources =
    selectedCategory === "All"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resource Browser</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <span>+</span> Upload Resource
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedCategory === "All"
                  ? "All Resources"
                  : `${selectedCategory} Resources`}
              </h2>
              <p className="text-gray-600">
                {filteredResources.length} items found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search resources..."
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Sort By
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getIcon(resource.type)}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {resource.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {resource.category}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <span>⋯</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{resource.size}</span>
                  <span>{resource.date}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                    Download
                  </button>
                  <button className="px-3 py-2 border rounded hover:bg-gray-50">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceBrowser;
