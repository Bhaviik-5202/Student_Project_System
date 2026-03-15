import { useCallback, useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

/**
 * ProjectTimeline Component
 * 
 * A high-level project orchestration and visualization tool. 
 * Features a dynamic Gantt-style overview of overlapping project 
 * phases, synchronized progress indicators, and milestone tracking 
 * for comprehensive roadmap management.
 */
const ProjectTimeline = memo(() => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/timeline');
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
  const gridLines = useMemo(() => Array.from({ length: 180 }), []);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Project Timeline
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Overview of all project timelines
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            New Project
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading timeline...</div>
        ) : (
          <>
            {/* Timeline Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Timeline Overview
          </h3>

          {/* Month Headers */}
          <div className="flex mb-4">
            <div className="w-48"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                {months.map((month, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-medium text-slate-700 dark:text-slate-300 w-16"
                  >
                    {month}
                  </div>
                ))}
              </div>
              <div className="flex">
                {gridLines.map((_, i) => (
                  <div
                    key={i}
                    className="h-4 border-r border-slate-200 dark:border-slate-700 w-1"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Bars */}
          <div className="space-y-6">
            {projects.map((project) => {
              const startMonth = new Date(project.start).getMonth();
              const endMonth = new Date(project.end).getMonth();
              const duration = endMonth - startMonth + 1;

              return (
                <div key={project.id} className="flex items-center">
                  <div className="w-48">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {project.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {project.start} - {project.end}
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    {/* Project Bar */}
                    <div className="relative h-10">
                      <div className="absolute top-1/2 left-0 right-0 h-3 bg-slate-200 dark:bg-slate-700 transform -translate-y-1/2 rounded-full"></div>
                      <div
                        className="absolute top-1/2 h-3 bg-blue-500 transform -translate-y-1/2 rounded-full"
                        style={{
                          left: `${(startMonth / 6) * 100}%`,
                          width: `${(duration / 6) * 100}%`,
                        }}
                      >
                        <div
                          className="h-3 bg-emerald-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>

                      {/* Start and End Markers */}
                      <div
                        className="absolute top-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"
                        style={{ left: `${(startMonth / 6) * 100}%` }}
                      ></div>
                      <div
                        className="absolute top-1/2 w-2 h-2 bg-rose-600 rounded-full transform -translate-y-1/2"
                        style={{ left: `${(endMonth / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {project.progress}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {project.milestones} milestones
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project List */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Projects
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Milestones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">
                      {project.start} to {project.end}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-900 dark:text-slate-100">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">
                      {project.milestones}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">
                      {project.team} members
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          handleNavigate(`/projects/${project.id}`)
                        }
                        className="text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 mr-3"
                      >
                        View
                      </button>
                      <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

ProjectTimeline.displayName = "ProjectTimeline";

export default ProjectTimeline;
