// src/components/pages/dashboard/ResourceQuickAccess.jsx
import { memo, useMemo } from "react";
import PropTypes from "prop-types";

const ResourceQuickAccess = memo(({ onNavigate }) => {
  const resources = useMemo(() => [
    { icon: "fa-book", label: "Library", color: "blue", action: "library" },
    {
      icon: "fa-chalkboard-teacher",
      label: "Tutoring",
      color: "green",
      action: "tutoring",
    },
    {
      icon: "fa-file-pdf",
      label: "Materials",
      color: "purple",
      action: "materials",
    },
    {
      icon: "fa-question-circle",
      label: "Support",
      color: "red",
      action: "support",
    },
    {
      icon: "fa-calendar-alt",
      label: "Calendar",
      color: "yellow",
      action: "calendar",
    },
    {
      icon: "fa-download",
      label: "Downloads",
      color: "indigo",
      action: "downloads",
    },
  ], []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        ⚡ Quick Access Resources
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <button
            key={index}
            onClick={() => onNavigate(resource.action)}
            className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${
                resource.color === "blue"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : resource.color === "green"
                  ? "bg-emerald-100 dark:bg-emerald-900"
                  : resource.color === "purple"
                  ? "bg-purple-100 dark:bg-purple-900"
                  : resource.color === "red"
                  ? "bg-rose-100 dark:bg-rose-900"
                  : resource.color === "yellow"
                  ? "bg-amber-100 dark:bg-amber-900"
                  : "bg-indigo-100 dark:bg-indigo-900"
              }`}
            >
              <i
                className={`fas ${resource.icon} ${
                  resource.color === "blue"
                    ? "text-blue-600 dark:text-blue-400"
                    : resource.color === "green"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : resource.color === "purple"
                    ? "text-purple-600 dark:text-purple-400"
                    : resource.color === "red"
                    ? "text-rose-600 dark:text-rose-400"
                    : resource.color === "yellow"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-indigo-600 dark:text-indigo-400"
                } text-lg`}
              ></i>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {resource.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Click to access</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onNavigate("resources")}
          className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          View All Resources
        </button>
      </div>
    </div>
  );
});

ResourceQuickAccess.displayName = 'ResourceQuickAccess';

ResourceQuickAccess.propTypes = {
  onNavigate: PropTypes.func,
};

export default ResourceQuickAccess;
