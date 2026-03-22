import React, { memo, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const GroupCard = memo(({ group }) => {
  const navigate = useNavigate();
  const isActive = group.status === "Active";
  const statusClass = isActive
    ? "bg-green-50 text-green-700"
    : "bg-blue-50 text-blue-700";

  return (
    <div className="project-card-simple">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {group.name}
            </h3>
            <span className={`project-badge ${statusClass}`}>
              {group.status}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              {group.guide}
            </span>
            <span className="flex items-center gap-2">
              {group.members.join(", ")}
            </span>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/projects/${group.projectId || group.id || group._id}`)}
          className="project-btn project-btn-primary"
        >
          Details
        </button>
      </div>

      <div className="pt-4 border-t border-gray-50 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gray-400">Progress</span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">{group.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${group.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
});

GroupCard.displayName = "GroupCard";

const ProjectGroupsList = memo(() => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/projects/groups');
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
    <div className="project-page animate-fade-in text-gray-600 dark:text-gray-400">
      <div className="project-header">
        <div>
          <h2 className="project-title text-gray-900 dark:text-white">Project Groups</h2>
          <p className="project-subtitle">Management for collaborative ventures</p>
        </div>
        <button 
          onClick={() => navigate("/projects/new")}
          className="project-btn project-btn-secondary"
        >
          Create Group
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm italic">Synchronizing groups...</div>
      ) : groups.length === 0 ? (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
          <h3 className="font-bold text-gray-900 dark:text-white">No Groups Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto leading-relaxed">System is currently clear of any project groups. Initialize a new one to begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
