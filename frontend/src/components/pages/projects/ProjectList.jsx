import React, { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import projectService from "../../../services/projectService";

const ProjectCard = memo(({ project, onNavigate }) => {
  const statusStyles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    purple: "bg-purple-50 text-purple-700",
  };

  const badgeClass = statusStyles[project.statusColor] || statusStyles.blue;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {project.title}
            </h3>
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${badgeClass}`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate(`/projects/${project.id || project._id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            Details
          </button>
          <button 
            onClick={() => onNavigate(`/projects/${project.id || project._id}/edit`)}
            className="border border-gray-200 dark:border-slate-700 hover:bg-gray-50 text-gray-600 dark:text-gray-400 text-xs font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Guide</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {project.guide?.name || project.guide || "Not Assigned"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Date(project.startDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Progress</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white">{project.progress}%</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Deadline</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Date(project.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

const ProjectList = memo(() => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      const res = await projectService.getAllProjects();
      if (res.success) {
        setProjects(res.data || []);
      } else {
        setError(res.message || "Failed to load projects");
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Catalog</h2>
          <p className="text-sm text-gray-500">Track milestones and deliverables</p>
        </div>
        <button 
          onClick={() => navigate("/projects/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <i className="fas fa-plus" /> New Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm italic">Accessing project archives...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm border border-red-100">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id || project._id} project={project} onNavigate={navigate} />
            ))
          ) : (
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
              <i className="fas fa-folder-open text-gray-300 text-3xl mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white">No Projects Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto leading-relaxed">No active projects found in your registry. Start by proposing a new one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProjectList.displayName = "ProjectList";
export default ProjectList;
