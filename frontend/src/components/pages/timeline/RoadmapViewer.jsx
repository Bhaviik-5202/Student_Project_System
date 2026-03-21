import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import timelineService from "../../../services/timelineService";
import projectService from "../../../services/projectService";

const RoadmapViewer = memo(() => {
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

  // Fetch timeline for selected project and map to roadmap
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const response = await timelineService.getByProject(selectedProjectId);
        if (response.success && response.data.length > 0) {
          const timeline = response.data[0];
          const milestones = Array.isArray(timeline.milestones) ? timeline.milestones : [];
          
          setProjectData({
            title: timeline.project?.title || "Strategic Roadmap",
            description: timeline.project?.description || "Visualizing the long-term project trajectory and key benchmarks.",
            phases: milestones.map((m, index) => {
              const date = new Date(m.dueDate);
              const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
              const year = date.getFullYear();
              
              return {
                id: m._id || m.id,
                name: m.title,
                status: m.completed ? "completed" : (index === 0 && !m.completed ? "in-progress" : "upcoming"),
                quarter: `${quarter} ${year}`,
                objectives: [
                  m.description || "Project milestone objective",
                  `Deadline: ${date.toLocaleDateString()}`,
                  m.completed ? "Criteria met" : "Execution pending"
                ]
              };
            })
          });
        } else {
          setProjectData(null);
        }
      } catch (error) {
        console.error("Failed to fetch roadmap data", error);
        setProjectData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [selectedProjectId]);

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const statusStyles = {
    completed: {
      indicator: "bg-emerald-500",
      card: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-300",
      bullet: "text-emerald-500",
    },
    "in-progress": {
      indicator: "bg-indigo-500",
      card: "border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/40 dark:bg-indigo-900/20",
      text: "text-indigo-700 dark:text-indigo-300",
      bullet: "text-indigo-500",
    },
    upcoming: {
      indicator: "bg-slate-300 dark:bg-slate-600",
      card: "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-800/40",
      text: "text-slate-500 dark:text-slate-400",
      bullet: "text-slate-400",
    },
  };

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <button
              onClick={() => handleNavigate("/timeline")}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 flex items-center mb-6 text-xs font-black uppercase tracking-[0.2em]"
            >
              ← Back to Overview
            </button>
            <div className="flex items-center gap-4 mb-2">
               <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                {projectData ? projectData.title : "Roadmap"}
              </h1>
              <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest h-fit">Strategic</div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold max-w-2xl">
              {projectData ? projectData.description : "Select a project to visualize its strategic trajectory."}
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Focus</span>
                <select 
                  value={selectedProjectId}
                  onChange={handleProjectChange}
                  className="bg-transparent border-none text-xs font-black text-indigo-600 dark:text-indigo-400 focus:ring-0 p-0 cursor-pointer uppercase tracking-tighter"
                >
                  <option value="" disabled>Select Venture</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">{p.title}</option>
                  ))}
                </select>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Compiling Strategy...</span>
          </div>
        ) : !projectData ? (
          <div className="p-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase italic tracking-tight">No Strategic Data</h3>
            <p className="text-xs text-slate-500 font-bold max-w-xs mx-auto">This project hasn't established its long-term milestones yet. Switch ventures or initialize a timeline.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden mb-12">
              <div className="relative z-10">
                {/* Visual Connector Line */}
                <div className="absolute left-[34px] right-0 top-[2.1rem] h-px bg-slate-100 dark:bg-slate-700 hidden lg:block"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative">
                  {projectData.phases.map((phase) => (
                    <div key={phase.id} className="relative group">
                      {/* Top Indicator */}
                      <div
                        className={`absolute top-0 left-6 lg:left-1/2 transform lg:-translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-[6px] border-white dark:border-slate-800 z-10 transition-all duration-500 shadow-lg ${
                          statusStyles[phase.status].indicator
                        } group-hover:scale-125`}
                      ></div>

                      {/* Phase Component */}
                      <div
                        className={`mt-10 p-8 border-2 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                          statusStyles[phase.status].card
                        }`}
                      >
                        <div className="mb-6">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight italic">
                              {phase.name}
                            </h3>
                            <span className="px-3 py-1 bg-white/50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-50 dark:border-slate-700">
                              {phase.quarter}
                            </span>
                          </div>
                          <div className={`text-[10px] font-black mt-3 uppercase tracking-[0.2em] px-2 py-0.5 rounded w-fit inline-block ${statusStyles[phase.status].text || 'bg-gray-100 text-gray-500'}`}>
                            {phase.status.replace("-", " ")}
                          </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Phase Objectives
                          </div>
                          <ul className="space-y-3">
                            {phase.objectives.map((objective, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-xs font-bold text-slate-600 dark:text-slate-400 group/item"
                              >
                                <span
                                  className={`mr-3 mt-0.5 transition-colors ${
                                    phase.status === "completed"
                                      ? statusStyles.completed.bullet
                                      : phase.status === "in-progress" && idx === 0
                                        ? statusStyles["in-progress"].bullet
                                        : statusStyles.upcoming.bullet
                                  } group-hover/item:scale-125`}
                                >
                                  {phase.status === "completed" || (phase.status === "in-progress" && idx === 0) ? "●" : "○"}
                                </span>
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 dark:bg-slate-700/20 blur-[100px] rounded-full -mr-48 -mt-48 opacity-50"></div>
            </div>

            {/* Legend Component */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">
                  Strategic Legend
                </h4>
                <p className="text-[10px] font-bold text-slate-400">Understanding the execution lifecycle</p>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"></div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">Validated</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">In Focus</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">Pipeline</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

RoadmapViewer.displayName = "RoadmapViewer";

export default RoadmapViewer;
