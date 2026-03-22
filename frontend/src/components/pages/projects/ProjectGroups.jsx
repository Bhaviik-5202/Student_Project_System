import React, { memo, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const GroupCard = memo(({ group }) => {
  const navigate = useNavigate();

  return (
    <div className="project-card-simple flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
            {group.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              {group.status}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {group.progress || 0}% PROGRESS
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/projects/${group.slug || group.projectId || group.id || group._id}`)}
          className="project-btn project-btn-primary px-4 py-2 text-xs"
        >
          Details
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <i className="fas fa-user-tie text-xs text-indigo-500" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            <strong>Guide:</strong> {group.guide}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <i className="fas fa-users text-xs text-indigo-500" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
            <strong>Team:</strong> {group.members.join(", ")}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 dark:border-slate-700">
        <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-700"
            style={{ width: `${group.progress || 0}%` }}
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
          {/* Diagnostic segment - only for troubleshooting */}
          <div className="hidden opacity-0 h-0 overflow-hidden pointer-events-none" id="diagnostic-data">
            {JSON.stringify(groups)}
          </div>
        </div>
      )}
    </div>
  );
});

ProjectGroupsList.displayName = "ProjectGroupsList";
export default ProjectGroupsList;
