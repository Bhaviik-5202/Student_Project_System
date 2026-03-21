import React, { memo, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import PropTypes from "prop-types";

const GroupCard = memo(({ group }) => {
  const navigate = useNavigate();
  const isActive = group.status === "Active";
  const statusClass = isActive
    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
  const progressClass = isActive ? "bg-green-500" : "bg-blue-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mr-3">
              {group.name}
            </h3>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusClass}`}
            >
              {group.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            <i className="fas fa-user-tie mr-2 text-gray-400 dark:text-gray-500" />
            Guide: {group.guide}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <i className="fas fa-users mr-2 text-gray-400 dark:text-gray-500" />
            Members: {group.members.join(", ")}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/projects/${group.projectId || group.id || group._id}`)}
            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
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
            <span>Project Progress</span>
            <span>{group.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${progressClass}`}
              style={{ width: `${group.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Group ID</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {group.id}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Project</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {group.project}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Members Count</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {group.members.length} students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

GroupCard.displayName = "GroupCard";

GroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    guide: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
  }).isRequired,
};

const ProjectGroupsList = memo(() => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/projects/groups');
        // The api interceptor returns response.data if success is present
        const data = response.data || [];
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch project groups", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Groups
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage student project groups
          </p>
        </div>
        <button 
          onClick={() => navigate("/projects/new")}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <i className="fas fa-users mr-2" /> Create Group
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading project groups...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id || group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
});

ProjectGroupsList.displayName = "ProjectGroupsList";

export default ProjectGroupsList;
