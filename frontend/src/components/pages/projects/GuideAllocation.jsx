import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import projectService from "../../../services/projectService";
import staffService from "../../../services/staffService";

const GuideCard = memo(({ guide }) => {
  const statusClass =
    guide.status === "Available"
      ? "text-green-600 dark:text-green-400"
      : "text-yellow-600 dark:text-yellow-400";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 card-hover">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
          <i className="fas fa-user-tie text-purple-600 dark:text-purple-400 text-xl" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {guide.guide}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {guide.department}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Allocated Groups
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {guide.allocatedGroups}/{guide.maxCapacity}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Students</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {guide.students}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Status</span>
          <span className={`font-medium ${statusClass}`}>{guide.status}</span>
        </div>
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
        View Details
      </button>
    </div>
  );
});

GuideCard.displayName = "GuideCard";

GuideCard.propTypes = {
  guide: PropTypes.shape({
    id: PropTypes.number.isRequired,
    guide: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    allocatedGroups: PropTypes.number.isRequired,
    maxCapacity: PropTypes.number.isRequired,
    students: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

const AllocationRow = memo(({ project }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      {project.id}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
          <i className="fas fa-project-diagram text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {project.name}
          </p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {project.group}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`text-sm ${
          project.currentGuide === "None"
            ? "text-yellow-600 dark:text-yellow-400 font-medium"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {project.currentGuide}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400">
        <option value="">Select Guide</option>
        <option value="1">Dr. Sarah Johnson</option>
        <option value="2">Prof. Michael Chen</option>
        <option value="3">Dr. Emily Williams</option>
      </select>
      <button className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
        Assign
      </button>
    </td>
  </tr>
));

AllocationRow.displayName = "AllocationRow";

AllocationRow.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    currentGuide: PropTypes.string.isRequired,
  }).isRequired,
};

const GuideAllocationList = memo(() => {
  const [allocations, setAllocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoadingGuides(true);
      const res = await staffService.getAllStaff();
      if (res.success) {
        setAllocations(
          (res.data || []).filter(s => s.role === "Faculty" || s.role === "Guide").map(g => ({
            id: g._id || g.id,
            guide: g.name,
            department: g.department || "General",
            allocatedGroups: g.allocatedGroups || 0,
            maxCapacity: g.maxCapacity || 5,
            students: g.studentsCount || 0,
            status: (g.allocatedGroups || 0) < (g.maxCapacity || 5) ? "Available" : "Full",
          }))
        );
      }
      setLoadingGuides(false);
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      const res = await projectService.getAllProjects();
      if (res.success) {
        setProjects(
          (res.data || []).map(p => ({
            id: p._id || p.id,
            name: p.title,
            group: p.teamMembers || "Ungrouped",
            currentGuide: p.guide || "None",
          }))
        );
      }
      setLoadingProjects(false);
    };

    fetchGuides();
    fetchProjects();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Guide Allocation
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Assign and manage project guides
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
          <i className="fas fa-user-tie mr-2" /> Assign Guide
        </button>
      </div>

      {/* Guides Overview */}
      {loadingGuides ? (
        <div className="p-8 text-center text-gray-500">Loading guides...</div>
      ) : allocations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No guides found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {allocations.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}

      {/* Projects for Allocation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Projects Pending Allocation
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Guide
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loadingProjects ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                   <td colSpan="5" className="p-8 text-center text-gray-500">No projects pending allocation.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <AllocationRow key={project.id} project={project} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

GuideAllocationList.displayName = "GuideAllocationList";

export default GuideAllocationList;
