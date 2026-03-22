import React, { useState, useMemo, useCallback, useEffect } from "react";
import api from "../../../utils/api";

const ProjectGallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([{ id: "all", name: "All Projects", count: 0 }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/portfolio/gallery");
        const data = response.data || {};
        if (data.projects) setProjects(data.projects);
        if (data.filters) setFilters([{ id: "all", name: "All Projects", count: data.projects?.length || 0 }, ...data.filters]);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (filter === "all") return true;
        return project.category === filter || project.status === filter;
      }),
    [projects, filter],
  );

  if (loading) return <div className="p-20 text-center text-gray-400 text-sm italic">Synchronizing gallery...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Gallery</h2>
          <p className="text-sm text-gray-500">Exhibition of institutional innovations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-gray-400"}`}
            >
              <i className="fas fa-th-large text-xs"></i>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-gray-400"}`}
            >
              <i className="fas fa-list text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Filtering */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              filter === f.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project._id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="h-40 bg-gray-50 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <i className="fas fa-project-diagram text-gray-200 text-4xl group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold text-gray-900 uppercase">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {project.title}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
                  <div className="flex gap-1">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span key={tech} className="bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded text-[8px] font-bold text-gray-400 uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                    {project.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm divide-y divide-gray-50 dark:divide-slate-700">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project._id}
              className="p-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center justify-center border border-gray-100 dark:border-slate-800">
                  <i className="fas fa-cube text-gray-300 text-xs" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{project.title}</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">{project.category} • {project.date}</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-indigo-600 uppercase">Review</button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-24 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
          <i className="fas fa-folder-open text-gray-300 text-3xl mb-4" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Gallery Empty</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">No ventures match the selected criteria</p>
        </div>
      )}

      {/* Detail Showcase Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                      {selectedProject.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {selectedProject.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full text-gray-400 transition-colors"
                >
                  <i className="fas fa-times" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Conceptual Blueprint</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Stack Architecture</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="bg-gray-50 dark:bg-slate-900 px-2.5 py-1 rounded text-[9px] font-bold text-gray-500 border border-gray-100 dark:border-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Core Team</h3>
                    <div className="space-y-2">
                      {selectedProject.team.map((member) => (
                        <div key={member} className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                            <i className="fas fa-user text-[8px] text-indigo-500" />
                          </div>
                          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-6 flex gap-3">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-indigo-100 transition-all">
                Launch Application
              </button>
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProjectGallery.displayName = "ProjectGallery";
export default React.memo(ProjectGallery);
