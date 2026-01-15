import React from "react";

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
