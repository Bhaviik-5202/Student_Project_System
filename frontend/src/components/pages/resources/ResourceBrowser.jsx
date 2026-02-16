// src/components/pages/resources/ResourceBrowser.jsx
import { useState, useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";

const ResourceCard = memo(({ resource, icon }) => (
  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all bg-white dark:bg-slate-800">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <i className={`${icon} text-xl`} />
        <div>
          <h4 className="font-medium text-slate-800 dark:text-white">
            {resource.name}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {resource.category}
          </p>
        </div>
      </div>
      <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
        <i className="fas fa-ellipsis-h" />
      </button>
    </div>

    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
      <span>{resource.size}</span>
      <span>{resource.date}</span>
    </div>

    <div className="mt-4 flex gap-2">
      <button className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50">
        Download
      </button>
      <button className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
        Preview
      </button>
    </div>
  </div>
));

ResourceCard.displayName = "ResourceCard";

ResourceCard.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  icon: PropTypes.string.isRequired,
};

const CategoryButton = memo(({ category, isActive, onSelect }) => (
  <button
    onClick={() => onSelect(category)}
    className={`px-4 py-2 rounded-lg ${
      isActive
        ? "bg-blue-600 text-white"
        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
    }`}
  >
    {category}
  </button>
));

CategoryButton.displayName = "CategoryButton";

CategoryButton.propTypes = {
  category: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

import { useEffect } from "react";
import resourceService from "../../services/resourceService";

const ResourceBrowser = memo(() => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await resourceService.getResources();
        setResources(data);
      } catch (err) {
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      "Documents",
      "Presentations",
      "Templates",
      "Design",
      "Videos",
    ],
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getIcon = useCallback((type) => {
    switch (type) {
      case "pdf":
        return "fas fa-file-alt text-blue-500";
      case "ppt":
        return "fas fa-file-powerpoint text-orange-500";
      case "zip":
        return "fas fa-file-archive text-yellow-500";
      case "fig":
        return "fas fa-palette text-purple-500";
      case "video":
        return "fas fa-video text-red-500";
      default:
        return "fas fa-folder text-gray-500";
    }
  }, []);

  const filteredResources = useMemo(
    () =>
      selectedCategory === "All"
        ? resources
        : resources.filter((r) => r.category === selectedCategory),
    [resources, selectedCategory],
  );

  const handleSelectCategory = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Resource Browser
        </h1>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
          <i className="fas fa-plus" /> Upload Resource
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              isActive={selectedCategory === category}
              onSelect={handleSelectCategory}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-md overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">Loading resources...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {selectedCategory === "All"
                      ? "All Resources"
                      : `${selectedCategory} Resources`}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {filteredResources.length} items found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                  />
                  <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                    Sort By
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    icon={getIcon(resource.type)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ResourceBrowser.displayName = "ResourceBrowser";

export default ResourceBrowser;
