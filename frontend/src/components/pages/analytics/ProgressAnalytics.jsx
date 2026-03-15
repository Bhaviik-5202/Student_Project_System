import { useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const ProgressAnalytics = memo(() => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get("/analytics/progress");
        setProjects(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch progress analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Progress Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Monitor project progress and completion rates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Progress Summary
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Average Progress
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mr-3">
                      {Math.round(
                        projects.reduce((sum, p) => sum + p.progress, 0) /
                          projects.length,
                      )}
                      %
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center">
                      <span>↑ 5.2%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Projects by Status
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        label: "On Track",
                        count: projects.filter((p) => p.timeline === "On Track")
                          .length,
                        color: "bg-emerald-500",
                      },
                      {
                        label: "Slightly Behind",
                        count: projects.filter(
                          (p) => p.timeline === "Slightly Behind",
                        ).length,
                        color: "bg-amber-500",
                      },
                      {
                        label: "Behind Schedule",
                        count: projects.filter(
                          (p) => p.timeline === "Behind Schedule",
                        ).length,
                        color: "bg-rose-500",
                      },
                      {
                        label: "Ahead",
                        count: projects.filter((p) => p.timeline === "Ahead")
                          .length,
                        color: "bg-blue-500",
                      },
                    ].map((status, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${status.color} mr-2`}
                          ></div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {status.label}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {status.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Project Progress Details
              </h3>              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-slate-500">Loading project progress...</div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No project progress data found.</div>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id || project._id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {project.name || project.title}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Team Size: {project.teamSize || 0} members
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            project.timeline === "On Track"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : project.timeline === "Ahead"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                : project.timeline === "Slightly Behind"
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                  : "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300"
                          }`}
                        >
                          {project.timeline || "Unknown"}
                        </span>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              (project.progress || 0) >= 80
                                ? "bg-emerald-500"
                                : (project.progress || 0) >= 60
                                  ? "bg-blue-500"
                                  : (project.progress || 0) >= 40
                                    ? "bg-amber-500"
                                  : "bg-rose-500"
                            }`}
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          View Details
                        </button>
                        <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                          View Team
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProgressAnalytics.displayName = "ProgressAnalytics";

export default ProgressAnalytics;
