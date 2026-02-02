import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";

const ProjectCard = memo(({ project }) => {
  const statusStyles = {
    blue: {
      badge: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      progress: "bg-blue-500",
    },
    green: {
      badge: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      progress: "bg-green-500",
    },
    yellow: {
      badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      progress: "bg-yellow-500",
    },
    purple: {
      badge: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      progress: "bg-purple-500",
    },
  };

  const style = statusStyles[project.statusColor] || statusStyles.blue;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mr-3">
              {project.title}
            </h3>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${style.badge}`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {project.description}
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            View Details
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            Edit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`${style.progress} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">End Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(project.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Guide</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {project.guide}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="font-medium text-gray-900 dark:text-white">2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    guide: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
  }).isRequired,
};

const ProjectList = memo(() => {
  const projects = useMemo(
    () => [
    {
      id: 1,
      title: "E-commerce Platform",
      status: "In Progress",
      statusColor: "blue",
      description: "Full-stack e-commerce website with payment integration",
      startDate: "2024-01-15",
      endDate: "2024-05-30",
      guide: "Dr. Sarah Johnson",
      progress: 65,
    },
    {
      id: 2,
      title: "AI Chatbot",
      status: "Completed",
      statusColor: "green",
      description: "Intelligent chatbot for customer service",
      startDate: "2023-09-01",
      endDate: "2023-12-15",
      guide: "Prof. Michael Chen",
      progress: 100,
    },
    ],
    []
    );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your projects
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
          <i className="fas fa-plus mr-2" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
});

ProjectList.displayName = "ProjectList";

export default ProjectList;
