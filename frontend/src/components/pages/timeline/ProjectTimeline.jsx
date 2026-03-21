import { useCallback, useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const ProjectTimeline = memo(() => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/timelines');
        const data = response.data || [];
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch timeline projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const months = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Project Timelines
          </h1>
          <p className="text-sm text-gray-500">
            Orchestration of active academic ventures
          </p>
        </div>
        <button 
          onClick={() => navigate('/projects/new')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
          New Project
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center text-gray-400 text-sm italic">Synchronizing roadmap...</div>
      ) : (
        <div className="space-y-6">
          {/* Timeline Visualization Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm overflow-hidden">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Temporal Overview</h3>
            
            <div className="relative">
              {/* Grid Headers */}
              <div className="flex mb-4">
                <div className="w-1/4"></div>
                <div className="flex-1 flex justify-between px-2">
                  {months.map((month) => (
                    <span key={month} className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{month}</span>
                  ))}
                </div>
              </div>

              {/* Project Tracks */}
              <div className="space-y-6">
                {projects.map((project) => {
                  const startMonth = new Date(project.start).getMonth();
                  const endMonth = new Date(project.end).getMonth();
                  const duration = Math.max(1, endMonth - startMonth + 1);

                  return (
                    <div key={project.id || project._id} className="flex items-center gap-4">
                      <div className="w-1/4">
                        <div className="text-xs font-bold text-gray-900 dark:text-white truncate" title={project.name}>
                          {project.name}
                        </div>
                        <div className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                          {project.progress}% Complete
                        </div>
                      </div>
                      <div className="flex-1 relative h-6 bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-800">
                        <div
                          className="absolute inset-y-0 bg-indigo-500/10 border-x border-indigo-500/20"
                          style={{
                            left: `${(startMonth / 6) * 100}%`,
                            width: `${(duration / 6) * 100}%`,
                          }}
                        >
                          <div
                            className="h-full bg-indigo-500 transition-all duration-1000"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project Details List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/40 border-b border-gray-100 dark:border-slate-700">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Venture</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                  {projects.map((project) => (
                    <tr key={project.id || project._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{project.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-gray-500">
                          {new Date(project.start).toLocaleDateString()} — {new Date(project.end).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 w-16 bg-gray-100 dark:bg-slate-900 rounded-full h-1">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/projects/${project.id || project._id}`)}
                          className="text-[10px] font-bold text-indigo-600 uppercase hover:underline"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProjectTimeline.displayName = "ProjectTimeline";
export default ProjectTimeline;
