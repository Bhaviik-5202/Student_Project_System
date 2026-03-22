import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const PerformanceMetrics = memo(() => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/performance");
        setMetrics(response.data || {});
      } catch (error) {
        console.error("Failed to fetch performance metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

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

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading performance metrics...</div>
        ) : Object.keys(metrics).length === 0 ? (
          <div className="p-8 text-center text-slate-500">No performance data available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(metrics)
              .filter(([key]) => key !== "trends")
              .map(([key, metric]) => (
              <div
                key={key}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {metric.current}%
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend === "up" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {metric.trend === "up" ? "↑ Improving" : "→ Stable"}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{metric.current}% / {metric.target}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(metric.current / metric.target) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Performance Trends
          </h3>
          <div className="space-y-8">
            <div className="flex justify-end gap-6 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <span className="text-xs text-slate-500">Overall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                <span className="text-xs text-slate-500">Attendance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                <span className="text-xs text-slate-500">Assignments</span>
              </div>
            </div>
            
            {(metrics.trends || [
              { month: "Sep", overall: 0, attendance: 0, assignments: 0 },
              { month: "Oct", overall: 0, attendance: 0, assignments: 0 },
              { month: "Nov", overall: 0, attendance: 0, assignments: 0 },
              { month: "Dec", overall: 0, attendance: 0, assignments: 0 },
              { month: "Jan", overall: 0, attendance: 0, assignments: 0 },
            ]).map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 w-12">{data.month}</span>
                  <div className="flex gap-4">
                    <span>O: {data.overall}%</span>
                    <span>A: {data.attendance}%</span>
                    <span>S: {data.assignments}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${data.overall}%` }}></div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${data.attendance}%` }}></div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${data.assignments}%` }}></div>
                  </div>
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
