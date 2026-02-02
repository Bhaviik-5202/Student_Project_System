import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const PerformanceMetrics = memo(() => {
  const navigate = useNavigate();
  const metrics = useMemo(
    () => ({
      overall: { current: 85, target: 90, trend: "up" },
      attendance: { current: 92, target: 95, trend: "stable" },
      assignments: { current: 88, target: 85, trend: "up" },
      projects: { current: 82, target: 80, trend: "up" },
      participation: { current: 78, target: 75, trend: "stable" },
    }),
    []
  );

  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Performance Metrics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track and analyze performance indicators
            </p>
          </div>
          <div className="flex gap-2">
            {["week", "month", "quarter", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${
                  timeRange === range
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(metrics).map(([key, metric]) => (
            <div
              key={key}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {metric.current}%
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend === "up"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                      : metric.trend === "down"
                      ? "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  {metric.trend === "up"
                    ? "↑ Improving"
                    : metric.trend === "down"
                    ? "↓ Declining"
                    : "→ Stable"}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {metric.current}% / {metric.target}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.current >= metric.target
                        ? "bg-emerald-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (metric.current / metric.target) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                Target: {metric.target}%
              </div>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Performance Trends
          </h3>
          <div className="space-y-6">
            {[
              { month: "Sep", overall: 78, attendance: 85, assignments: 72 },
              { month: "Oct", overall: 80, attendance: 88, assignments: 75 },
              { month: "Nov", overall: 82, attendance: 90, assignments: 78 },
              { month: "Dec", overall: 83, attendance: 91, assignments: 80 },
              { month: "Jan", overall: 85, attendance: 92, assignments: 82 },
            ].map((data, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span className="font-medium">{data.month}</span>
                  <span>
                    Overall: {data.overall}% | Attendance: {data.attendance}% |
                    Assignments: {data.assignments}%
                  </span>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div
                    className="bg-blue-500"
                    style={{ width: `${data.overall}%` }}
                    title={`Overall: ${data.overall}%`}
                  ></div>
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${data.attendance}%` }}
                    title={`Attendance: ${data.attendance}%`}
                  ></div>
                  <div
                    className="bg-purple-500"
                    style={{ width: `${data.assignments}%` }}
                    title={`Assignments: ${data.assignments}%`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

PerformanceMetrics.displayName = "PerformanceMetrics";

export default PerformanceMetrics;
