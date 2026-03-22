import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import timelineService from "../../../services/timelineService";
import projectService from "../../../services/projectService";

const MilestoneTracker = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(id || "");
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all projects for the selector
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        if (response.success && Array.isArray(response.data)) {
          setProjects(response.data);
          if (!selectedProjectId && response.data.length > 0) {
            setSelectedProjectId(response.data[0]._id || response.data[0].id);
          } else if (response.data.length === 0) {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedProjectId]);

  // Fetch timeline for selected project
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const data = await timelineService.getByProject(selectedProjectId);
        // data should be an array based on timelineService.getByProject returning response.data (which is the array)
        if (Array.isArray(data) && data.length > 0) {
          const timeline = data[0];
          const milestones = Array.isArray(timeline.milestones) ? timeline.milestones : [];
          setProjectData({
            name: timeline.project?.title || "Project Milestones",
            milestones: milestones.map(m => ({
              id: m._id || m.id,
              name: m.title,
              description: m.description,
              dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : "TBD",
              status: m.completed ? "completed" : "pending",
              progress: m.completed ? 100 : 0
            }))
          });
        } else {
          setProjectData(null);
        }
      } catch (error) {
        console.error("Failed to fetch milestone data", error);
        setProjectData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, [selectedProjectId]);


  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const statusStyles = {
    completed: {
      dot: "bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    },
    "in-progress": {
      dot: "bg-amber-500",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    },
    pending: {
      dot: "bg-slate-400",
      badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    },
  };

  const progressStyles = {
    high: "bg-emerald-500",
    medium: "bg-indigo-500",
    low: "bg-amber-500",
  };

  const stats = useMemo(() => {
    if (!projectData || !projectData.milestones) return { completed: 0, inProgress: 0, pending: 0 };
    const completed = projectData.milestones.filter(m => m.status === "completed").length;
    const inProgress = projectData.milestones.filter(m => m.status === "in-progress").length;
    const pending = projectData.milestones.filter(m => m.status === "pending").length;

    return { completed, inProgress, pending };
  }, [projectData]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="project-page animate-fade-in text-gray-600 dark:text-gray-400">
      <div className="project-header">
        <div>
          <h1 className="project-title text-gray-900 dark:text-white">Milestone Tracker</h1>
          <div className="flex items-center gap-3 mt-1.5 font-medium">
            <span className="text-sm text-gray-500">Archives:</span>
            <select 
              value={selectedProjectId}
              onChange={handleProjectChange}
              className="bg-transparent border-none text-sm font-bold text-indigo-600 dark:text-indigo-400 focus:ring-0 p-0 cursor-pointer transition-all"
            >
              <option value="" disabled>Select Venture</option>
              {projects.map(p => (
                <option key={p._id || p.id} value={p._id || p.id} className="text-gray-900 dark:text-white bg-white dark:bg-slate-800 text-sm">{p.title}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
          >
            Temporal View
          </button>
          <button 
            onClick={() => navigate(`/timeline-editor/${selectedProjectId}`)}
            className="project-btn project-btn-primary"
          >
            New Milestone
          </button>
        </div>
      </div>


        {/* Content Area */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-20 text-center shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-400 italic">Synchronizing milestone archives...</p>
          </div>
        ) : !projectData ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 p-20 text-center shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Milestones Found</h3>
            <p className="text-xs text-gray-500 max-w-[200px] mx-auto leading-relaxed">No milestones have been established for this project archives.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="project-card-simple overflow-hidden relative">
              <div className="relative z-10">
                {/* Timeline Axis */}
                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gray-50 dark:bg-slate-700/50"></div>

                <div className="space-y-6">
                  {projectData.milestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-12 group">
                      {/* Timeline Node */}
                      <div
                        className={`absolute left-[18px] top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 z-20 shadow-sm ${
                          statusStyles[milestone.status].dot
                        }`}
                      ></div>

                      {/* Milestone Component */}
                      <div className="bg-gray-50/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/30 transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">Phase Milestone</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                              {milestone.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400">Target:</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{milestone.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              statusStyles[milestone.status].badge
                            }`}
                          >
                            {milestone.status.replace("-", " ")}
                          </span>
                        </div>

                        {milestone.description && (
                          <div className="mb-6 bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-gray-50 dark:border-slate-700/50">
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        )}

                        {/* Progress Tracker */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-gray-400">Execution Fidelity</span>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{milestone.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ease-out ${
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

                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-gray-50 dark:border-slate-700/50">
                          <button 
                            onClick={() => navigate(`/projects/${selectedProjectId}`)}
                            className="project-btn project-btn-primary w-full sm:flex-1"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => navigate(`/timeline-editor/${selectedProjectId}`)}
                            className="project-btn project-btn-secondary w-full sm:w-auto"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="project-card-simple">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600">
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Completed</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {stats.completed}
                </div>
              </div>
              
              <div className="project-card-simple">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">In Progress</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {stats.inProgress}
                </div>
              </div>
              
              <div className="project-card-simple">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center text-yellow-600">
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Pending</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {stats.pending}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
});

MilestoneTracker.displayName = "MilestoneTracker";

export default MilestoneTracker;
