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
        if (response.success) {
          setProjects(response.data);
          if (!selectedProjectId && response.data.length > 0) {
            setSelectedProjectId(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
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
        const response = await timelineService.getByProject(selectedProjectId);
        if (response.success && response.data.length > 0) {
          const timeline = response.data[0];
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center mb-6 text-xs font-black uppercase tracking-[2px] transition-all hover:-translate-x-1"
          >
            ← Back to Timelines
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
                Milestone Tracker
              </h1>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Live Monitoring</span>
                </div>
                <select 
                  value={selectedProjectId}
                  onChange={handleProjectChange}
                  className="bg-transparent border-none text-xs font-bold text-gray-500 dark:text-gray-400 focus:ring-0 p-0 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <option value="" disabled>Change Active Venture</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id} className="text-gray-900 dark:text-white bg-white dark:bg-slate-800">{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/timeline-editor')}
              className="w-full md:w-auto px-8 py-4 bg-gray-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Add Milestone
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing Data...</span>
          </div>
        ) : !projectData ? (
          <div className="py-32 text-center bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm group">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 dark:bg-slate-700 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">Trajectory Unknown</h3>
            <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">This venture hasn't established its professional trajectory. Initialize the timeline to begin tracking.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-10 mb-8 shadow-sm overflow-hidden relative">
              <div className="relative z-10">
                {/* Timeline Axis */}
                <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-indigo-500/30 via-gray-100 dark:via-slate-700 to-transparent"></div>

                <div className="space-y-12">
                  {projectData.milestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-20 group">
                      {/* Timeline Node */}
                      <div
                        className={`absolute left-6 top-3 w-4 h-4 rounded-full border-4 border-white dark:border-slate-800 z-20 shadow-lg transform group-hover:scale-[1.75] transition-all duration-500 ${
                          statusStyles[milestone.status].dot
                        }`}
                      ></div>
                      
                      <div className="absolute left-[34px] top-5 w-8 h-[1px] bg-gray-100 dark:bg-slate-700"></div>

                      {/* Milestone Component */}
                      <div className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-8 hover:border-indigo-500/40 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-700">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] font-mono">Phase Objective</span>
                              <div className="h-[1px] flex-1 bg-gray-50 dark:bg-slate-800"></div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight italic">
                              "{milestone.name}"
                            </h3>
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Delivery</span>
                                <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums">{milestone.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <span
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform ${
                              statusStyles[milestone.status].badge
                            }`}
                          >
                            {milestone.status.replace("-", " ")}
                          </span>
                        </div>

                        {milestone.description && (
                          <div className="mb-8 p-6 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-bold leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        )}

                        {/* Velocity Monitor */}
                        <div className="mb-8 p-6 bg-indigo-50/30 dark:bg-slate-800/30 rounded-2xl border border-indigo-50 dark:border-slate-700">
                          <div className="flex justify-between items-end mb-3">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-[0.3em]">Execution Fidelity</span>
                              <span className="text-[10px] font-bold text-gray-400">Phase Completion Analysis</span>
                            </div>
                            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter tabular-nums">{milestone.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner">
                            <div
                              className={`h-full transition-all duration-1000 ease-out shadow-lg ${
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

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-50 dark:border-slate-800/50">
                          <button className="w-full sm:flex-1 px-6 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95">
                            Analytical Deep Dive
                          </button>
                          <button className="w-full sm:w-auto px-6 py-3 border-2 border-gray-100 dark:border-slate-700 text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95">
                            Modify Phase
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full -ml-32 -mb-32"></div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-8 shadow-sm group hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Metrics</span>
                </div>
                <div className="text-5xl font-black text-emerald-500 tracking-tighter mb-1 tabular-nums">
                  {stats.completed}
                </div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
                  Validated Phases
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-8 shadow-sm group hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Velocity</span>
                </div>
                <div className="text-5xl font-black text-amber-500 tracking-tighter mb-1 tabular-nums">
                  {stats.inProgress}
                </div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
                  Active Cycles
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-8 shadow-sm group hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Outlook</span>
                </div>
                <div className="text-5xl font-black text-indigo-500 tracking-tighter mb-1 tabular-nums">
                  {stats.pending}
                </div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
                  Scheduled Benchmarks
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MilestoneTracker.displayName = "MilestoneTracker";

export default MilestoneTracker;
