import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";

const MilestoneTracker = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await api.get(`/timelines/project/${id || 'current'}`);
        if (response.data) {
          setProject({
            name: response.data[0]?.project?.title || "Project Milestones",
            milestones: response.data.map(m => ({
              id: m._id || m.id,
              name: m.title || m.name,
              dueDate: new Date(m.dueDate).toLocaleDateString(),
              status: m.status || "pending",
              progress: m.progress || 0
            }))
          });
        }
      } catch (error) {
        console.error("Failed to fetch milestone data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, []);

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

  const progressStyles = {
    high: "bg-emerald-500",
    medium: "bg-blue-500",
    low: "bg-amber-500",
  };

  const stats = useMemo(() => {
    if (!project || !project.milestones) return { completed: 0, inProgress: 0, pending: 0 };
    const completed = project.milestones.filter(
      (m) => m.status === "completed",
    ).length;
    const inProgress = project.milestones.filter(
      (m) => m.status === "in-progress",
    ).length;
    const pending = project.milestones.filter(
      (m) => m.status === "pending",
    ).length;

    return { completed, inProgress, pending };
  }, [project]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 flex items-center mb-4"
          >
            ← Back to Timeline
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Milestone Tracker
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                {project ? project.name : "Loading..."}
              </p>
            </div>
            <button 
              onClick={() => navigate('/timeline-editor')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Milestone
            </button>
          </div>
        </div>

        {/* Timeline Visualization */}
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading milestones...</div>
        ) : !project ? (
          <div className="p-8 text-center text-slate-500">No milestone data found</div>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-700"></div>

            {/* Milestones */}
            <div className="space-y-8">
              {project.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-6 top-2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${
                      statusStyles[milestone.status].dot
                    }`}
                  ></div>

                  {/* Milestone Card */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {milestone.name}
                        </h3>
                        <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          Due: {milestone.dueDate}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusStyles[milestone.status].badge
                        }`}
                      >
                        {milestone.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-1">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            milestone.progress === 100
                              ? progressStyles.high
                              : milestone.progress >= 50
                                ? progressStyles.medium
                                : progressStyles.low
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60">
                        View Details
                      </button>
                      <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {stats.completed}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              Completed Milestones
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {stats.inProgress}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              In Progress
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {stats.pending}
            </div>
              <div className="text-slate-600 dark:text-slate-300">Pending</div>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  );
});

MilestoneTracker.displayName = "MilestoneTracker";

export default MilestoneTracker;
