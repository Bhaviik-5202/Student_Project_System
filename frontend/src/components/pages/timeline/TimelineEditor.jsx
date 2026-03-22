import { useCallback, useState, useEffect, memo, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import timelineService from "../../../services/timelineService";
import projectService from "../../../services/projectService";

const TimelineEditor = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
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
          
          // If we have an ID or slug from URL, find the matching project
          if (id) {
            const foundProject = response.data.find(p => p._id === id || p.slug === id);
            if (foundProject) {
              setSelectedProjectId(foundProject._id);
            } else if (response.data.length > 0) {
              // Fallback to first project if the specific ID/slug wasn't found
              setSelectedProjectId(response.data[0]._id);
            }
          } else if (response.data.length > 0) {
            setSelectedProjectId(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, [id]);

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
    const newId = e.target.value;
    const project = projects.find(p => p._id === newId);
    if (project) {
      navigate(`/timeline-editor/${project.slug || newId}`);
    } else {
      setSelectedProjectId(newId);
    }
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
      // Prepare milestones by removing temporary IDs
      const cleanedMilestones = timeline.milestones.map(m => {
        const { _id, ...rest } = m;
        // Only keep _id if it's a valid MongoDB ObjectId (24 chars hex)
        if (_id && /^[0-9a-fA-F]{24}$/.test(_id)) {
          return { _id, ...rest };
        }
        return rest;
      });

      let response;
      if (timeline._id) {
        response = await timelineService.update(timeline._id, {
          ...timeline,
          milestones: cleanedMilestones
        });
      } else {
        response = await timelineService.create({
          project: selectedProjectId,
          milestones: cleanedMilestones
        });
      }
      
      if (response && response.success) {
        toast.success("Timeline successfully synchronized");
        navigate("/timeline");
      } else {
        toast.error(response?.message || "Failed to preserve timeline");
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
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider mb-2 flex items-center gap-1"
          >
            <i className="fas fa-arrow-left" /> Back to Timelines
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Timeline Editor
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest">Editor</span>
            </div>
            <select 
              value={selectedProjectId}
              onChange={handleProjectChange}
              className="bg-transparent border-none text-xs font-bold text-gray-500 dark:text-gray-400 focus:ring-0 p-0 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <option value="" disabled>Select Project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id} className="text-gray-900 dark:text-white bg-white dark:bg-slate-800 text-sm">{p.title}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={saveTimeline}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-6 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <i className="fas fa-save mr-2" /> {loading ? "Saving..." : "Save Timeline"}
          </button>
        </div>
      </div>

      {fetching ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-20 text-center shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400 italic">Accessing timeline archives...</p>
        </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Configuration Panel */}
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
                   <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 tracking-widest border-b border-gray-50 dark:border-slate-700 pb-2">
                      New Milestone
                   </h3>
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest mb-1 shadow-sm block">Objective Title</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="e.g. Beta Launch"
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400"
                          value={newMilestone.title}
                          onChange={handleNewMilestoneChange}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest mb-1 block">Target Delivery</label>
                        <input
                          type="date"
                          name="dueDate"
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                          value={newMilestone.dueDate}
                          onChange={handleNewMilestoneChange}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest mb-1 block">Scope Description</label>
                        <textarea
                          name="description"
                          rows="3"
                          placeholder="What must be achieved?"
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder:text-gray-400"
                          value={newMilestone.description}
                          onChange={handleNewMilestoneChange}
                        ></textarea>
                      </div>
                      <button
                        onClick={addMilestone}
                        className="w-full py-2 bg-gray-900 dark:bg-indigo-600 text-white rounded-lg text-xs font-bold tracking-wider hover:opacity-90 transition-all active:scale-95"
                      >
                        <i className="fas fa-plus mr-2" /> Stage Objective
                      </button>
                   </div>
                </div>
                
                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 tracking-widest mb-2 flex items-center gap-2">
                        <i className="fas fa-info-circle text-[8px]" /> Editor's Note
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Staged objectives are only preserved once you save the timeline. Ensure your trajectory is logically consistent.</p>
                </div>
             </div>

             {/* Trajectory Manifest */}
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm min-h-[500px]">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-widest">Phase Manifest ({timeline.milestones.length})</h3>
                      <div className="h-px flex-1 mx-6 bg-gray-50 dark:bg-slate-700/50"></div>
                   </div>
                   
                   {timeline.milestones.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                        <i className="fas fa-history text-gray-200 text-4xl mb-4" />
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white tracking-widest mb-2">Timeline Uninitialized</h4>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">Stage your first objective to begin planning your project timeline archives.</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {timeline.milestones.map((m, i) => (
                           <div key={m._id || m.id} className="bg-gray-50/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/30 transition-all">
                              <div className="flex items-start justify-between gap-4">
                                 <div className="flex items-center gap-4 flex-1">
                                    <button 
                                      onClick={() => toggleMilestoneStatus(m._id || m.id)}
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                                        m.completed 
                                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                                          : 'border-gray-200 dark:border-slate-700 text-transparent hover:border-indigo-500'
                                      }`}
                                    >
                                       <i className="fas fa-check text-xs" />
                                    </button>
                                    <div className="flex-1">
                                       <div className="flex items-center gap-2 mb-1">
                                          <h4 className={`text-base font-bold transition-all ${m.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                            {m.title}
                                          </h4>
                                          <span className="text-[10px] font-bold text-indigo-500/50">#{i + 1}</span>
                                       </div>
                                       <div className="flex items-center gap-3">
                                          <span className="text-[10px] font-bold text-gray-400 tracking-widest tabular-nums">Due: {new Date(m.dueDate).toLocaleDateString()}</span>
                                          <span className={`text-[10px] font-bold tracking-widest ${m.completed ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                            {m.completed ? 'Validated' : 'Scheduled'}
                                          </span>
                                       </div>
                                       {m.description && (
                                         <p className="mt-3 text-xs text-gray-500 leading-relaxed italic border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                                           {m.description}
                                         </p>
                                       )}
                                    </div>
                                 </div>
                                 
                                 <button
                                   onClick={() => removeMilestone(m._id || m.id)}
                                   className="w-8 h-8 rounded-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-500/30 transition-all"
                                 >
                                    <i className="fas fa-trash-alt text-xs" />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
    </div>
  );
});

TimelineEditor.displayName = "TimelineEditor";

export default TimelineEditor;
