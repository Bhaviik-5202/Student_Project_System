import { useCallback, useState, useEffect, useMemo, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import timelineService from "../../../services/timelineService";
import projectService from "../../../services/projectService";

const SprintPlanner = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(id || "");
  const [sprints, setSprints] = useState([]);
  const [activeSprintId, setActiveSprintId] = useState(null);
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

  // Fetch timeline and map milestones to sprints
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const response = await timelineService.getByProject(selectedProjectId);
        if (response.success && response.data.length > 0) {
          const timeline = response.data[0];
          const mappedSprints = (timeline.milestones || []).map((m, index) => ({
            id: m._id || m.id,
            name: `Sprint ${index + 1}: ${m.title}`,
            start: index === 0 ? new Date(timeline.createdAt).toLocaleDateString() : new Date(timeline.milestones[index-1].dueDate).toLocaleDateString(),
            end: new Date(m.dueDate).toLocaleDateString(),
            status: m.completed ? "completed" : (index === 0 && !m.completed ? "in-progress" : "planned"),
            velocity: 0, 
            completed: 0,
            tasks: []
          }));
          setSprints(mappedSprints);
          if (mappedSprints.length > 0) {
            const current = mappedSprints.find(s => s.status === "in-progress") || mappedSprints[0];
            setActiveSprintId(current.id);
          }
        } else {
          setSprints([]);
          setActiveSprintId(null);
        }
      } catch (error) {
        console.error("Failed to fetch sprints", error);
        setSprints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [selectedProjectId]);

  const activeSprintData = useMemo(
    () => sprints.find((s) => s.id === activeSprintId),
    [sprints, activeSprintId],
  );

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const sprintStatusStyles = {
    completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    "in-progress": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
    planned: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };

  const taskStatusStyles = {
    completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    "in-progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    todo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const activeProjectTitle = useMemo(() => {
    return projects.find(p => p._id === selectedProjectId)?.title || "Project Tasks";
  }, [projects, selectedProjectId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 flex items-center mb-6 text-xs font-black uppercase tracking-[0.2em]"
          >
            ← Back to Overview
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                  Sprint Planner
                </h1>
                <div className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-black tracking-widest leading-none">Agile</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{activeProjectTitle}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <select 
                  value={selectedProjectId}
                  onChange={handleProjectChange}
                  className="bg-transparent border-none text-[10px] font-black text-indigo-600 dark:text-indigo-400 focus:ring-0 p-0 cursor-pointer uppercase tracking-widest"
                >
                  <option value="" disabled>Change Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="px-6 py-3 bg-gray-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black tracking-[0.2em] shadow-lg transition-all hover:scale-105 active:scale-95">
              Launch New Sprint
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Optimizing Workflow...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Sprint Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-8 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 dark:text-white mb-6 tracking-[0.2em] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  Iteration Cycles
                </h3>
                <div className="space-y-4">
                  {sprints.length === 0 ? (
                    <p className="text-[10px] font-bold text-slate-400 italic">No iterations established</p>
                  ) : (
                    sprints.map((sprint) => (
                      <button
                        key={sprint.id}
                        onClick={() => setActiveSprintId(sprint.id)}
                        className={`w-full p-5 text-left rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                          activeSprintId === sprint.id
                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-x-1"
                            : "bg-gray-50/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/50 hover:border-indigo-500/50"
                        }`}
                      >
                        <div className={`text-xs font-black tracking-tight mb-2 ${activeSprintId === sprint.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {sprint.name}
                        </div>
                        <div className={`text-[9px] font-bold tracking-widest mb-3 ${activeSprintId === sprint.id ? 'text-indigo-100/70' : 'text-slate-400'}`}>
                          {sprint.start} — {sprint.end}
                        </div>
                        <div className="flex justify-between items-center relative z-10">
                          <span className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded ${
                            activeSprintId === sprint.id 
                              ? 'bg-white/20 text-white' 
                              : sprintStatusStyles[sprint.status]
                          }`}>
                            {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                          </span>
                        </div>
                        {activeSprintId === sprint.id && (
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30"></div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Iteration Command Center */}
            <div className="lg:col-span-3">
              {activeSprintData ? (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-10 shadow-sm relative overflow-hidden">
                   <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                      <div>
                        <div className="text-[10px] font-black text-indigo-500 tracking-[0.3em] mb-2">Cycle Overview</div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                          "{activeSprintData.name}"
                        </h3>
                        <div className="flex items-center gap-3 mt-4">
                           <div className="px-3 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center gap-2">
                              <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-widest">Timeframe</span>
                              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 tabular-nums">{activeSprintData.start} — {activeSprintData.end}</span>
                           </div>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.2em] transform rotate-1 ${sprintStatusStyles[activeSprintData.status]}`}>
                        {activeSprintData.status}
                      </span>
                    </div>

                    {/* Cycle Velocity Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                      {[
                        { label: 'Intensity', value: activeSprintData.velocity, color: 'text-slate-900 dark:text-white', sub: 'Total Points' },
                        { label: 'Validated', value: activeSprintData.completed, color: 'text-emerald-500', sub: 'Executed' },
                        { label: 'Pending', value: activeSprintData.velocity - activeSprintData.completed, color: 'text-amber-500', sub: 'Remaining' },
                        { label: 'Density', value: activeSprintData.tasks.length, color: 'text-indigo-600 dark:text-indigo-400', sub: 'Sub-Objectives' }
                      ].map((metric, i) => (
                        <div key={i} className="bg-gray-50/50 dark:bg-slate-900/40 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 transition-all hover:scale-105">
                           <div className="text-[9px] font-black text-gray-400 tracking-widest mb-1">{metric.label}</div>
                           <div className={`text-3xl font-black font-mono tracking-tighter ${metric.color}`}>{metric.value}</div>
                           <div className="text-[8px] font-bold text-gray-300 mt-1">{metric.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Visual Fidelity Monitor */}
                    <div className="mb-12 p-8 bg-indigo-50/30 dark:bg-slate-900/30 rounded-3xl border border-indigo-50/50 dark:border-slate-700">
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-[0.25em]">Execution Fidelity</span>
                           <span className="text-[9px] font-bold text-gray-400">Iterative Progress Synchronization</span>
                        </div>
                        <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter">
                          {Math.round((activeSprintData.completed / activeSprintData.velocity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${(activeSprintData.completed / activeSprintData.velocity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Operational Tasks */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                          Sprint Objectives
                        </h4>
                        <button className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest decoration-2">Manage All</button>
                      </div>
                      <div className="space-y-4">
                        {activeSprintData.tasks.map((task, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-700/50 rounded-2xl hover:border-indigo-500/30 transition-all group/task shadow-sm hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-none">
                            <div className="flex items-center gap-4 flex-1">
                               <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-gray-400 text-xs">0{index + 1}</div>
                               <div>
                                  <div className="font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 italic">
                                    "{task.task}"
                                  </div>
                                  <div className="flex items-center gap-3">
                                     <span className="text-[9px] font-bold text-slate-400 tracking-widest">Lead: {task.assignee}</span>
                                     <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                     <span className="text-[9px] font-black text-indigo-500/70 tracking-widest">{task.points} Influence Points</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                              <span className={`px-3 py-1.5 text-[9px] font-black tracking-widest rounded-lg ${taskStatusStyles[task.status]}`}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </span>
                              <button className="w-8 h-8 rounded-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual Accent */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[100px] rounded-full -mr-40 -mt-40"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Select Cycle</h3>
                   <p className="text-[10px] font-bold text-slate-400 tracking-widest">Synchronize with an iterative focus to begin deep work.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SprintPlanner.displayName = "SprintPlanner";

export default SprintPlanner;
