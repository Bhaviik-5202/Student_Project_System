import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const ProjectDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.success) {
        setProject(response.data);
      } else {
        toast.error(response.message || "Failed to load project details");
      }
    } catch (error) {
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const statusStyles = useMemo(
    () => ({
      Completed: "bg-green-50 text-green-700",
      "In Progress": "bg-blue-50 text-blue-700",
      Pending: "bg-yellow-50 text-yellow-700",
      planning: "bg-yellow-50 text-yellow-700",
      in_progress: "bg-blue-50 text-blue-700",
      completed: "bg-green-50 text-green-700",
    }),
    [],
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm italic">
        Retrieving project specifications...
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1 hover:underline"
          >
            <i className="fas fa-arrow-left" /> Back to Catalog
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${statusStyles[project.status] || statusStyles.Pending}`}>
              {project.status}
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              ID: {project.id || project._id}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-6 rounded-lg shadow-sm transition-colors">
            Edit Metadata
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4 border-b border-gray-50 dark:border-slate-700 pb-2">
              Objective & Scope
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {project.description}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-50 dark:border-slate-700 pb-2">
              Execution Strategy
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Phase Completion</span>
                <span className="text-indigo-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4 border-b border-gray-50 dark:border-slate-700 pb-2">
              Vital Statistics
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Primary Mentor</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {project.guide?.name || project.guide || "Awaiting Assignment"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Initiation</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {project.startDate}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Target Culmination</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {project.endDate}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4 border-b border-gray-50 dark:border-slate-700 pb-2">
              Collaborative Unit
            </h2>
            <div className="space-y-3 mt-4">
              {Array.isArray(project.members) && project.members.length > 0 ? (
                project.members.map((member, index) => (
                  <div key={member._id || index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-100 dark:border-slate-700">
                      {(member.name || member).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white block">
                        {member.name || member}
                      </span>
                      {member.rollNumber && <span className="text-[10px] font-bold text-gray-400 uppercase">{member.rollNumber}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No collaborative data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectDetails.displayName = "ProjectDetails";
export default ProjectDetails;
