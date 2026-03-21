import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import resourceService from "../../../services/resourceService";
import useNotification from "../../../hooks/useNotification";

const CategoryTab = memo(({ category, isActive, onSelect }) => (
  <button
    onClick={() => onSelect(category.id)}
    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
      isActive
        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {category.name} ({category.count})
  </button>
));

CategoryTab.displayName = "CategoryTab";

const TemplateCard = memo(({ template, onDownload, onPreview }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <i className="fas fa-file-invoice text-blue-500 text-xl" />
      </div>
      <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded uppercase">
        {template.type}
      </span>
    </div>

    <h3 className="font-bold text-gray-800 dark:text-white mb-2">
      {template.title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
      {template.description}
    </p>

    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
      <span className="flex items-center">
        <i className="fas fa-calendar mr-1" />
        {new Date(template.createdAt).toLocaleDateString()}
      </span>
      <span>{template.size || "MB"}</span>
    </div>

    <div className="flex space-x-2">
      <button
        onClick={() => onDownload(template)}
        className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg flex items-center justify-center"
      >
        <i className="fas fa-download mr-2" />
        Download
      </button>
      <button
        onClick={() => onPreview(template)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <i className="fas fa-eye" />
      </button>
    </div>
  </div>
));

TemplateCard.displayName = "TemplateCard";

const TemplateLibrary = memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await resourceService.getAll({ type: "template" });
        if (res.success) {
          setTemplates(res.data || []);
        } else {
          setError(res.message || "Failed to load templates.");
        }
      } catch (err) {
        setError("Failed to load templates.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const categories = useMemo(() => {
    const cats = templates.reduce((acc, t) => {
      const cat = t.type || "template";
      if (!acc[cat]) acc[cat] = { id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) + 's', count: 0 };
      acc[cat].count++;
      return acc;
    }, {});
    return [
      { id: "all", name: "All Templates", count: templates.length },
      ...Object.values(cats)
    ];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const lowered = searchTerm.toLowerCase();
    return templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(lowered) ||
        (template.description && template.description.toLowerCase().includes(lowered));
      const matchesCategory =
        selectedCategory === "all" || template.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const handleDownload = useCallback(
    (template) => {
      if (template.url) window.open(template.url, "_blank");
      showSuccess(`Downloading ${template.title}`);
    },
    [showSuccess],
  );

  const handlePreview = useCallback(
    (template) => {
      if (template.url) window.open(template.url, "_blank");
      showSuccess(`Previewing ${template.title}`);
    },
    [showSuccess],
  );

  const handleCategorySelect = useCallback((id) => {
    setSelectedCategory(id);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Template Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse and download project templates
          </p>
        </div>
        <button 
          onClick={() => navigate("/resource-upload")}
          className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg flex items-center">
          <i className="fas fa-plus mr-2" />
          Upload Template
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading templates...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
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
              <CategoryTab
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onSelect={handleCategorySelect}
              />
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template._id || template.id}
                template={template}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-gray-300 dark:text-gray-600 text-4xl mb-3" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                No templates found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Templates
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">
                  {templates.filter(t => t.type === 'template').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Design Templates
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600">
                   {templates.filter(t => new Date(t.createdAt).getMonth() === new Date().getMonth()).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  New This Month
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-yellow-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Availability
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

TemplateLibrary.displayName = "TemplateLibrary";

export default TemplateLibrary;
