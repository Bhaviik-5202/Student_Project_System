import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";

const ProjectTypeRow = memo(({ type }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      PT{type.id.toString().padStart(3, "0")}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
          <i className="fas fa-project-diagram text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {type.name}
          </p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {type.description}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {type.duration}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {type.maxStudents} students
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
        {type.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
        <i className="fas fa-edit" />
      </button>
      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
        <i className="fas fa-trash" />
      </button>
    </td>
  </tr>
));

ProjectTypeRow.displayName = "ProjectTypeRow";

ProjectTypeRow.propTypes = {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    maxStudents: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

const ProjectTypesList = memo(() => {
  const projectTypes = useMemo(
    () => [
      {
        id: 1,
        name: "Research Project",
        description: "Academic research-based projects",
        duration: "6 months",
        maxStudents: 2,
        status: "Active",
      },
      {
        id: 2,
        name: "Software Development",
        description: "Web and mobile application development",
        duration: "4 months",
        maxStudents: 4,
        status: "Active",
      },
      {
        id: 3,
        name: "Hardware Project",
        description: "IoT and embedded systems projects",
        duration: "5 months",
        maxStudents: 3,
        status: "Active",
      },
    ],
    [],
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Types
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage different types of projects
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
          <i className="fas fa-plus mr-2" /> Add Project Type
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Max Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {projectTypes.map((type) => (
                <ProjectTypeRow key={type.id} type={type} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

ProjectTypesList.displayName = "ProjectTypesList";

export default ProjectTypesList;
