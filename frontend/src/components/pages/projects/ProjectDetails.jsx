import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const ProjectDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        setError(response.message || "Project specifications not found in registry.");
        toast.error(response.message || "Failed to load project details");
      }
    } catch (error) {
      setError("Critical system error while retrieving project data.");
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} | Student Project System`;
    }
    return () => {
      document.title = "Student Project System";
    };
  }, [project]);

  const statusStyles = useMemo(
    () => ({
      Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      planning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    }),
    [],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Synchronizing project directives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-exclamation-triangle text-red-500 text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Registry Error</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button onClick={() => navigate("/projects")} className="project-btn project-btn-primary px-8">Return to Catalog</button>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="project-page animate-fade-in">
      <div className="project-container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate("/projects")}
              className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-2 flex items-center gap-2 hover:underline"
            >
              <i className="fas fa-arrow-left" /> Back to Projects
            </button>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              {project.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[project.status] || statusStyles.Pending}`}>
                {project.status?.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold text-gray-400">
                {project.type}
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/projects/${project.slug || project.id || project._id}/edit`)}
            className="project-btn project-btn-primary"
          >
            Edit Project
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="project-card-simple pb-8">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Description</h2>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.abstract || project.description}
              </div>
              
              {project.objectives && (
                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-700">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Objectives</h2>
                  <p className="text-sm italic">{project.objectives}</p>
                </div>
              )}
            </div>

            <div className="project-card-simple">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Execution Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-gray-400">PROGRESS</span>
                  <span className="text-sm font-black text-indigo-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-2">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 block mb-1">START DATE</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 block mb-1">END DATE</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="project-card-simple">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Project Guide</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-slate-700">
                  <i className="fas fa-user-tie" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    {project.guide?.name || project.guide || "Not Assigned"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Faculty Mentor</p>
                </div>
              </div>
            </div>

            <div className="project-card-simple">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Members</h2>
              <div className="space-y-3">
                {Array.isArray(project.members) && project.members.length > 0 ? (
                  project.members.map((member, index) => (
                    <div key={member._id || index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-gray-500">
                        {member.name?.charAt(0) || "M"}
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {member.name || (typeof member === 'string' ? member : "Unknown")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-gray-400">No members assigned</p>
                )}
                {project.teamMembers && (
                  <div className="mt-2 pt-2 border-t border-gray-50 dark:border-slate-700 text-xs text-gray-500">
                    <strong>Other:</strong> {project.teamMembers}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectDetails.displayName = "ProjectDetails";
export default ProjectDetails;
