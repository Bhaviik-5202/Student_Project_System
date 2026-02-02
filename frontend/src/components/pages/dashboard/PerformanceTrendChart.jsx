// src/components/pages/dashboard/PerformanceTrendChart.jsx
import { memo, useState } from "react";

const PerformanceTrendChart = memo(({ data }) => {
  const [activePoint, setActivePoint] = useState(null);

  if (!data || data.length === 0) return null;

  const maxGPA = Math.max(...data.map((d) => d.gpa));
  const minGPA = Math.min(...data.map((d) => d.gpa));
  const range = maxGPA - minGPA;

  const getYPosition = (gpa) => {
    const percentage = ((gpa - minGPA) / range) * 80;
    return 100 - percentage;
  };

  const getPathData = () => {
    let path = `M 0,${getYPosition(data[0].gpa)} `;
    const segmentWidth = 100 / (data.length - 1);

    data.forEach((point, index) => {
      if (index === 0) return;

      const x = index * segmentWidth;
      const y = getYPosition(point.gpa);
      path += `L ${x},${y} `;
    });

    return path;
  };

  const getAreaPath = () => {
    let path = `M 0,${getYPosition(data[0].gpa)} `;
    const segmentWidth = 100 / (data.length - 1);

    data.forEach((point, index) => {
      if (index === 0) return;

      const x = index * segmentWidth;
      const y = getYPosition(point.gpa);
      path += `L ${x},${y} `;
    });

    path += `L 100,100 L 0,100 Z`;
    return path;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          📈 Performance Trend
        </h3>
        <span className="text-sm text-slate-600 dark:text-slate-400">Last 5 months</span>
      </div>

      <div className="relative h-48">
        {/* Chart container */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((line) => (
            <line
              key={`h-line-${line}`}
              x1="0"
              y1={line}
              x2="100"
              y2={line}
              stroke="#cbd5e1"
              strokeWidth="0.5"
              className="dark:stroke-slate-600"
            />
          ))}

          {/* Area under line */}
          <path d={getAreaPath()} fill="url(#gradient)" fillOpacity="0.2" />

          {/* Line path */}
          <path
            d={getPathData()}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = (index * 100) / (data.length - 1);
            const y = getYPosition(point.gpa);

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3B82F6"
                  onMouseEnter={() => setActivePoint({ ...point, x, y })}
                  onMouseLeave={() => setActivePoint(null)}
                  className="cursor-pointer hover:r-3 transition-all"
                />

                {/* Tooltip on hover */}
                {activePoint && activePoint.month === point.month && (
                  <g>
                    <rect
                      x={x - 20}
                      y={y - 35}
                      width="40"
                      height="25"
                      rx="4"
                      fill="#1F2937"
                      className="shadow-lg"
                    />
                    <text
                      x={x}
                      y={y - 20}
                      textAnchor="middle"
                      fill="white"
                      fontSize="3"
                      fontWeight="bold"
                    >
                      GPA: {point.gpa}
                    </text>
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="2.5"
                    >
                      {point.month}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{maxGPA.toFixed(1)}</span>
          <span>{((maxGPA + minGPA) / 2).toFixed(1)}</span>
          <span>{minGPA.toFixed(1)}</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((point, index) => (
          <span key={index}>{point.month}</span>
        ))}
      </div>

      {/* Current performance summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Current GPA</div>
            <div className="text-2xl font-bold text-gray-900">
              {data[data.length - 1].gpa}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Trend</div>
            <div
              className={`flex items-center ${
                data[data.length - 1].gpa > data[0].gpa
                  ? "text-green-600"
                  : data[data.length - 1].gpa < data[0].gpa
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {data[data.length - 1].gpa > data[0].gpa ? (
                <>
                  <i className="fas fa-arrow-up mr-1"></i>
                  <span className="font-medium">Improving</span>
                </>
              ) : data[data.length - 1].gpa < data[0].gpa ? (
                <>
                  <i className="fas fa-arrow-down mr-1"></i>
                  <span className="font-medium">Declining</span>
                </>
              ) : (
                <>
                  <i className="fas fa-minus mr-1"></i>
                  <span className="font-medium">Stable</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;
