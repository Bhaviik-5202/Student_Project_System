import React, { useState } from "react";
// import { useNotification } from "../../hooks/useNotification";

const TemplateLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { showSuccess } = useNotification();

  const categories = [
    { id: "all", name: "All Templates", count: 48 },
    { id: "project", name: "Project Templates", count: 18 },
    { id: "report", name: "Report Templates", count: 12 },
    { id: "proposal", name: "Proposal Templates", count: 8 },
    { id: "meeting", name: "Meeting Templates", count: 6 },
    { id: "other", name: "Other Templates", count: 4 },
  ];

  const templates = [
    {
      id: 1,
      name: "Project Proposal Template",
      category: "proposal",
      description: "Standard template for project proposals",
      downloads: 156,
      lastUpdated: "2024-01-15",
      fileSize: "2.4 MB",
      icon: "fas fa-file-alt text-blue-500",
    },
    {
      id: 2,
      name: "Weekly Progress Report",
      category: "report",
      description: "Template for weekly project updates",
      downloads: 234,
      lastUpdated: "2024-01-10",
      fileSize: "1.8 MB",
      icon: "fas fa-chart-line text-green-500",
    },
    {
      id: 3,
      name: "Meeting Minutes",
      category: "meeting",
      description: "Format for documenting meeting discussions",
      downloads: 189,
      lastUpdated: "2024-01-12",
      fileSize: "1.2 MB",
      icon: "fas fa-calendar-alt text-purple-500",
    },
    {
      id: 4,
      name: "Risk Assessment Matrix",
      category: "project",
      description: "Template for risk evaluation and management",
      downloads: 145,
      lastUpdated: "2024-01-05",
      fileSize: "3.1 MB",
      icon: "fas fa-exclamation-triangle text-yellow-500",
    },
    {
      id: 5,
      name: "Project Timeline",
      category: "project",
      description: "Gantt chart template for project scheduling",
      downloads: 278,
      lastUpdated: "2024-01-08",
      fileSize: "4.2 MB",
      icon: "fas fa-project-diagram text-indigo-500",
    },
    {
      id: 6,
      name: "Budget Proposal",
      category: "proposal",
      description: "Financial planning template",
      downloads: 167,
      lastUpdated: "2024-01-03",
      fileSize: "2.8 MB",
      icon: "fas fa-dollar-sign text-green-600",
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (template) => {
    showSuccess(`Downloading ${template.name}`);
    // Download logic here
  };

  const handlePreview = (template) => {
    showSuccess(`Previewing ${template.name}`);
    // Preview logic here
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Template Library</h2>
          <p className="text-gray-600 mt-1">
            Browse and download project templates
          </p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
          <i className="fas fa-plus mr-2"></i>
          Upload Template
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className={`${template.icon} text-xl`}></i>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                {template.category.toUpperCase()}
              </span>
            </div>

            <h3 className="font-bold text-gray-800 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <i className="fas fa-download mr-1"></i>
                {template.downloads}
              </span>
              <span className="flex items-center">
                <i className="fas fa-calendar mr-1"></i>
                {template.lastUpdated}
              </span>
              <span>{template.fileSize}</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(template)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <i className="fas fa-download mr-2"></i>
                Download
              </button>
              <button
                onClick={() => handlePreview(template)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <i className="fas fa-eye"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-search text-gray-300 text-4xl mb-3"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No templates found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">48</div>
            <div className="text-sm text-gray-600">Total Templates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">1.2K</div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">18</div>
            <div className="text-sm text-gray-600">Project Templates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">15</div>
            <div className="text-sm text-gray-600">Updated This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;
