// src/components/pages/dashboard/ResourceQuickAccess.jsx
const ResourceQuickAccess = ({ onNavigate }) => {
  const resources = [
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
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        ⚡ Quick Access Resources
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <button
            key={index}
            onClick={() => onNavigate(resource.action)}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 transition-all duration-200 group"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${
                resource.color === "blue"
                  ? "bg-blue-100"
                  : resource.color === "green"
                  ? "bg-green-100"
                  : resource.color === "purple"
                  ? "bg-purple-100"
                  : resource.color === "red"
                  ? "bg-red-100"
                  : resource.color === "yellow"
                  ? "bg-yellow-100"
                  : "bg-indigo-100"
              }`}
            >
              <i
                className={`fas ${resource.icon} ${
                  resource.color === "blue"
                    ? "text-blue-600"
                    : resource.color === "green"
                    ? "text-green-600"
                    : resource.color === "purple"
                    ? "text-purple-600"
                    : resource.color === "red"
                    ? "text-red-600"
                    : resource.color === "yellow"
                    ? "text-yellow-600"
                    : "text-indigo-600"
                } text-lg`}
              ></i>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {resource.label}
            </span>
            <span className="text-xs text-gray-500 mt-1">Click to access</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => onNavigate("resources")}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          View All Resources
        </button>
      </div>
    </div>
  );
};

export default ResourceQuickAccess;
