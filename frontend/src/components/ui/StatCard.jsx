const StatCard = ({ title, value, icon, color, change, trend }) => {
  // Map color strings to actual Tailwind classes
  const colorMap = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  };

  const trendIcons = {
    up: "fa-arrow-up",
    down: "fa-arrow-down",
    attention: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    attention: "text-yellow-600",
    info: "text-blue-600",
  };

  const selectedColor = colorMap[color] || colorMap.blue;
  const trendIcon = trendIcons[trend] || "fa-info-circle";
  const trendColor = trendColors[trend] || "text-gray-600";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 card-hover transition-all duration-300">
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
        <span className={`text-sm font-medium ${trendColor}`}>
          <i className={`fas ${trendIcon} mr-1`}></i> {change}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
