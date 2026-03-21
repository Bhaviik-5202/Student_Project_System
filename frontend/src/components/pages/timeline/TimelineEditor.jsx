import { useCallback, useState, useEffect, memo, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import timelineService from "../../../services/timelineService";
import projectService from "../../../services/projectService";

const TimelineEditor = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(id || "");
  const [timeline, setTimeline] = useState({
    project: "",
    milestones: [],
  });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    dueDate: "",
    description: "",
  });

  // Fetch all projects for selection
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

  // Fetch timeline for the selected project
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchTimeline = async () => {
      setFetching(true);
      try {
        const response = await timelineService.getByProject(selectedProjectId);
        if (response.success && response.data.length > 0) {
          setTimeline(response.data[0]);
        } else {
          // Initialize a blank timeline for the selected project
          setTimeline({
            project: selectedProjectId,
            milestones: [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch timeline data", error);
      } finally {
        setFetching(false);
      }
    };
    fetchTimeline();
  }, [selectedProjectId]);

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const handleNewMilestoneChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewMilestone((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addMilestone = useCallback(() => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast.error("Title and Date are required for a milestone");
      return;
    }

    const tempId = Date.now().toString();
    setTimeline((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { ...newMilestone, _id: tempId, completed: false }],
    }));
    setNewMilestone({ title: "", dueDate: "", description: "" });
    toast.success("Milestone staged");
  }, [newMilestone]);

  const removeMilestone = useCallback((mid) => {
    setTimeline((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => (m._id || m.id) !== mid),
    }));
    toast.success("Milestone removed");
  }, []);

  const toggleMilestoneStatus = useCallback((mid) => {
    setTimeline((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => 
        (m._id || m.id) === mid ? { ...m, completed: !m.completed } : m
      ),
    }));
  }, []);

  const saveTimeline = useCallback(async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project first");
      return;
    }
    
    setLoading(true);
    try {
      let response;
      if (timeline._id) {
        response = await timelineService.update(timeline._id, timeline);
      } else {
        response = await timelineService.create({
          project: selectedProjectId,
          milestones: timeline.milestones.map(({ _id, ...rest }) => rest) // Remove temp IDs if any
        });
      }
      
      if (response.success) {
        toast.success("Timeline successfully synchronized");
        navigate("/timeline");
      } else {
        toast.error(response.message || "Failed to preserve timeline");
      }
    } catch (error) {
      toast.error("Critical synchronization failure");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [timeline, selectedProjectId, navigate]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center mb-6 text-xs font-black uppercase tracking-[0.2em] transition-all hover:-translate-x-1"
          >
            ← Back to Overviews
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
            <div className="flex flex-col relative z-10">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none mb-3">
                Timeline Architect
              </h1>
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Structural Management</span>
                 </div>
                 <select 
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                    className="bg-transparent border-none text-[11px] font-black text-slate-400 dark:text-slate-500 focus:ring-0 p-0 cursor-pointer uppercase tracking-widest hover:text-indigo-600 transition-colors"
                  >
                    <option value="" disabled>Select Venture</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">{p.title}</option>
                    ))}
                  </select>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto relative z-10">
              <button
                onClick={saveTimeline}
                disabled={loading}
                className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Synchronizing..." : "Preserve Timeline"}
              </button>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          </div>
        </div>

        {fetching ? (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Decoding Architecture...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             {/* Configuration Panel */}
             <div className="lg:col-span-1 space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-8 shadow-sm">
                   <h3 className="text-xs font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                      New Milestone
                   </h3>
                   <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Objective Title</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="e.g. Beta Launch"
                          className={inputClass}
                          value={newMilestone.title}
                          onChange={handleNewMilestoneChange}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Target Delivery</label>
                        <input
                          type="date"
                          name="dueDate"
                          className={inputClass}
                          value={newMilestone.dueDate}
                          onChange={handleNewMilestoneChange}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Scope Description</label>
                        <textarea
                          name="description"
                          rows="3"
                          placeholder="What must be achieved?"
                          className={`${inputClass} resize-none`}
                          value={newMilestone.description}
                          onChange={handleNewMilestoneChange}
                        ></textarea>
                      </div>
                      <button
                        onClick={addMilestone}
                        className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-indigo-400 dark:hover:text-white transition-all active:scale-95"
                      >
                        Stage Objective
                      </button>
                   </div>
                </div>
                
                <div className="bg-indigo-600/5 dark:bg-indigo-950/20 p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/50">
                    <h4 className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest mb-2 italic">Architect's Note</h4>
                    <p className="text-[10px] font-bold text-indigo-600/70 dark:text-indigo-400/60 leading-relaxed uppercase tracking-tight">Staged objectives are only preserved once you commit to 'Preserve Timeline'. Ensure your trajectory is logically consistent.</p>
                </div>
             </div>

             {/* Trajectory Manifest */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-10 shadow-sm relative overflow-hidden min-h-[600px]">
                   <div className="flex justify-between items-center mb-10 relative z-10">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Phase Manifest ({timeline.milestones.length})</h3>
                      <div className="h-px flex-1 mx-8 bg-gray-50 dark:bg-slate-700/50"></div>
                   </div>
                   
                   {timeline.milestones.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 dark:border-slate-700/50 rotate-3 group-hover:rotate-0 transition-transform">
                           <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 leading-none">Trajectory Uninitialized</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-xs leading-relaxed">Stage your first objective to begin architectural planning.</p>
                     </div>
                   ) : (
                     <div className="space-y-6 relative z-10">
                        {timeline.milestones.map((m, i) => (
                           <div key={m._id || m.id} className="group relative bg-white dark:bg-slate-900/40 border-2 border-transparent hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5">
                              <div className="flex items-start justify-between gap-6">
                                 <div className="flex items-center gap-5 flex-1">
                                    <button 
                                      onClick={() => toggleMilestoneStatus(m._id || m.id)}
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                                        m.completed 
                                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                          : 'border-gray-100 dark:border-slate-700 text-transparent hover:border-indigo-500'
                                      }`}
                                    >
                                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <div>
                                       <div className="flex items-center gap-3 mb-1">
                                          <h4 className={`text-xl font-black tracking-tighter leading-none italic transition-all ${m.completed ? 'text-slate-400 line-through decoration-2' : 'text-slate-900 dark:text-white'}`}>
                                            "{m.title}"
                                          </h4>
                                          <span className="text-[10px] font-black text-indigo-500/50 font-mono">0{i + 1}</span>
                                       </div>
                                       <div className="flex items-center gap-3">
                                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest tabular-nums">Deadline: {new Date(m.dueDate).toLocaleDateString()}</span>
                                          <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                          <span className={`text-[9px] font-black uppercase tracking-widest ${m.completed ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                            {m.completed ? 'Validated' : 'Scheduled'}
                                          </span>
                                       </div>
                                       {m.description && (
                                         <p className="mt-4 text-xs font-bold text-slate-500 leading-relaxed italic border-l-2 border-gray-50 dark:border-slate-800 pl-4">
                                           {m.description}
                                         </p>
                                       )}
                                    </div>
                                 </div>
                                 
                                 <button
                                   onClick={() => removeMilestone(m._id || m.id)}
                                   className="w-10 h-10 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-300 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-50/50 transition-all"
                                 >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                   )}
                   
                   {/* Background Overlay */}
                   <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-32 -mb-32"></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
});

TimelineEditor.displayName = "TimelineEditor";

export default TimelineEditor;
