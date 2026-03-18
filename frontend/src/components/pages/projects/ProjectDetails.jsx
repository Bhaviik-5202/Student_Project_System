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
      Completed:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      "In Progress":
        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      Pending:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      planning:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      in_progress:
        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      completed:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    }),
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/projects")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4 font-medium"
          >
            ← Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h1>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusStyles[project.status] || statusStyles.Pending
              }`}
            >
              {project.status}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Progress: {project.progress}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Project Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Progress
              </h2>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 h-2.5 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>0%</span>
                <span className="font-medium">{project.progress}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Project Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supervisor
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white text-capitalize">
                    {project.guide?.name || project.guide || "Not Assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {project.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    End Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {project.endDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Team Members
              </h2>
              <div className="space-y-3">
                {Array.isArray(project.members) && project.members.length > 0 ? (
                  project.members.map((member, index) => (
                    <div key={member._id || index} className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3 overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {member.name ? member.name.charAt(0).toUpperCase() : (typeof member === 'string' ? member.charAt(0).toUpperCase() : 'U')}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white block">
                          {member.name || member}
                        </span>
                        {member.rollNumber && <span className="text-xs text-gray-500 dark:text-gray-400">{member.rollNumber}</span>}
                      </div>
                    </div>
                  ))
                ) : Array.isArray(project.teamMembers) ? (
                  project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3 overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {member.name ? member.name.charAt(0).toUpperCase() : (typeof member === 'string' ? member.charAt(0).toUpperCase() : 'U')}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white block">
                          {member.name || member}
                        </span>
                        {member.role && <span className="text-xs text-gray-500 dark:text-gray-400">{member.role}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {project.teamMembers || "No team members listed"}
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
