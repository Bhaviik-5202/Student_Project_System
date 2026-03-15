import { useState, useEffect, useMemo, memo } from "react";
import api from "../../../utils/api";

const GanttChart = memo(() => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGanttData = async () => {
      try {
        const response = await api.get('/timeline/gantt');
        const data = response.data || [];
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch Gantt data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGanttData();
  }, []);

  const months = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], []);
  const gridLines = useMemo(() => Array.from({ length: 180 }), []);

  const statusStyles = {
    completed: {
      dot: "bg-emerald-500",
      badge:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    },
    "in-progress": {
      dot: "bg-amber-500",
      badge:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    },
    pending: {
      dot: "bg-slate-400",
      badge:
        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Project Timeline
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Visualize project schedules and milestones
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Project
          </button>
        </div>

        {/* Timeline Header */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex">
            <div className="w-48"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                {months.map((month, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    {month} 2024
                  </div>
                ))}
              </div>
              <div className="flex">
                {gridLines.map((_, i) => (
                  <div
                    key={i}
                    className="h-4 border-r border-slate-200 dark:border-slate-700 w-1"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Timeline */}
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading Gantt chart...</div>
        ) : (
          <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-48">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {project.start} - {project.end}
                  </p>
                </div>
                <div className="flex-1 relative">
                  {/* Timeline Bar */}
                  <div className="relative h-10">
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-200 dark:bg-slate-700 transform -translate-y-1/2 rounded-full"></div>
                    <div
                      className="absolute top-1/2 left-0 h-2 bg-blue-500 transform -translate-y-1/2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>

                    {/* Milestone Markers */}
                    {project.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className="absolute top-1/2 transform -translate-y-1/2"
                        style={{
                          left: `${
                            (idx + 1) * (100 / (project.milestones.length + 1))
                          }%`,
                        }}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            statusStyles[milestone.status].dot
                          }`}
                        ></div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 text-center">
                          {milestone.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-32 text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 rounded-full text-sm">
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Milestones List */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                  Milestones
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {project.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          {milestone.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            statusStyles[milestone.status].badge
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          Due: {milestone.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

GanttChart.displayName = "GanttChart";

export default GanttChart;
