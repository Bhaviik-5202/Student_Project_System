const StatCard = ({ title, value, icon, color, change, trend }) => {
  // Map color names to actual Tailwind classes
  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      border: "border-indigo-200",
    },
  };

  const trendIcons = {
    up: { icon: "fa-arrow-up", color: "text-green-600" },
    down: { icon: "fa-arrow-down", color: "text-red-600" },
    attention: { icon: "fa-exclamation-circle", color: "text-yellow-600" },
    info: { icon: "fa-info-circle", color: "text-blue-600" },
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;
  const selectedTrend = trendIcons[trend] || trendIcons.info;

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border ${selectedColor.border} card-hover transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className={`w-12 h-12 ${selectedColor.bg} rounded-full flex items-center justify-center`}
        >
          <i className={`fas ${icon} ${selectedColor.text} text-xl`}></i>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${selectedTrend.color}`}>
          <i className={`fas ${selectedTrend.icon} mr-1`}></i> {change}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
