import { useState, useEffect, useMemo, memo } from "react";
import timelineService from "../../../services/timelineService";

const GanttChart = memo(() => {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGanttData = async () => {
      try {
        const response = await timelineService.getAll();
        if (response.success) {
          const mappedData = response.data.map(t => {
            const total = t.milestones?.length || 0;
            const completed = t.milestones?.filter(m => m.completed).length || 0;
            
            const dates = t.milestones?.map(m => new Date(m.dueDate).getTime()).filter(d => !isNaN(d)) || [];
            const start = dates.length > 0 ? new Date(Math.min(...dates)).toLocaleDateString() : new Date(t.createdAt).toLocaleDateString();
            const end = dates.length > 0 ? new Date(Math.max(...dates)).toLocaleDateString() : new Date(t.updatedAt).toLocaleDateString();

            return {
              id: t._id,
              name: t.project?.title || "Unknown Project",
              start: start,
              end: end,
              progress: total > 0 ? Math.round((completed / total) * 100) : 0,
              milestones: (t.milestones || []).map(m => ({
                name: m.title,
                status: m.completed ? "completed" : "pending",
                date: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "TBD"
              }))
            };
          });
          setTimelines(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch Gantt data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGanttData();
  }, []);

  const months = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], []);
  const gridLines = useMemo(() => Array.from({ length: 120 }), []);

  const statusStyles = {
    completed: {
      dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    },
    "in-progress": {
      dot: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]",
      badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
    },
    pending: {
      dot: "bg-slate-300 dark:bg-slate-600",
      badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
             <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Strategic Scheduler
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest pl-11">
              Visualize professional project trajectories
            </p>
          </div>
          <button className="px-6 py-3 bg-gray-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95 leading-none">
            Add New Venture
          </button>
        </div>

        {/* Gantt Visualization */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden mb-12 animate-in fade-in zoom-in duration-1000">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] p-8">
              {/* Timeline Header */}
              <div className="flex mb-10 relative">
                <div className="w-64 flex-shrink-0">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Project Registry</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-4 border-b border-gray-50 dark:border-slate-700/50 pb-4">
                    {months.map((month, index) => (
                      <div
                        key={index}
                        className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                  <div className="flex relative h-4">
                    {gridLines.map((_, i) => (
                      <div
                        key={i}
                        className="h-full border-r border-gray-100 dark:border-slate-700/50 w-full"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects List */}
              {loading ? (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compiling Visuals...</span>
                </div>
              ) : timelines.length === 0 ? (
                 <div className="py-20 text-center">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight italic">No Active Trajectories</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Initialize project timelines to begin strategic mapping.</p>
                 </div>
              ) : (
                <div className="space-y-12">
                  {timelines.map((project) => (
                    <div key={project.id} className="group relative">
                      <div className="flex items-center">
                        <div className="w-64 flex-shrink-0 pr-10">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2 truncate group-hover:text-indigo-600 transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded leading-none">
                              {project.start} — {project.end}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 relative py-4">
                          {/* Grid Background Overlay */}
                          <div className="absolute inset-0 flex">
                             {Array.from({length: 12}).map((_, i) => (
                               <div key={i} className="flex-1 border-r border-gray-50 dark:border-slate-700/30 h-full"></div>
                             ))}
                          </div>

                          {/* Progress Track */}
                          <div className="relative h-12 flex items-center">
                            <div className="absolute inset-x-0 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.4)] transition-all duration-1000 ease-out"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>

                            {/* Milestone Marker Pins */}
                            <div className="absolute inset-x-0 top-0 bottom-0 flex">
                              {project.milestones.map((milestone, idx) => (
                                <div
                                  key={idx}
                                  className="absolute top-1/2 transform -translate-y-1/2 group/pin"
                                  style={{
                                    left: `${Math.max(5, Math.min(95, (idx + 1) * (100 / (project.milestones.length + 1))))}%`,
                                  }}
                                >
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-4 h-4 rounded-full border-4 border-white dark:border-slate-800 z-10 transition-all duration-500 scale-75 group-hover/pin:scale-125 shadow-md ${
                                        statusStyles[milestone.status]?.dot || statusStyles.pending.dot
                                      }`}
                                    ></div>
                                    <div className="absolute top-6 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/pin:translate-y-0">
                                      <div className="bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl">
                                        {milestone.name} • {milestone.date}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="w-24 flex-shrink-0 text-right pl-6">
                           <div className="flex flex-col items-end">
                              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter tabular-nums leading-none">
                                {project.progress}%
                              </span>
                              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Completion</span>
                           </div>
                        </div>
                      </div>

                      {/* Expanded Details on Hover */}
                      <div className="mt-4 border-t border-gray-50 dark:border-slate-700/50 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {project.milestones.map((m, i) => (
                               <div key={i} className="bg-gray-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                                  <div className="flex items-center gap-2 mb-2">
                                     <div className={`w-1.5 h-1.5 rounded-full ${statusStyles[m.status]?.dot || 'bg-slate-300'}`}></div>
                                     <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase truncate tracking-tight">{m.name}</span>
                                  </div>
                                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Delivery: {m.date}</div>
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
          
          {/* Aesthetic Overlay */}
          <div className="bg-indigo-600/5 h-2 w-full"></div>
        </div>

        {/* Legend Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm gap-6">
           <div className="flex flex-col">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1 leading-none">Chronological Legend</h4>
              <p className="text-[10px] font-bold text-slate-400">Mapping the evolution of active ventures</p>
           </div>
           <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"></div>
                 <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Finalized</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Velocity</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pipeline</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
});

GanttChart.displayName = "GanttChart";

export default GanttChart;
