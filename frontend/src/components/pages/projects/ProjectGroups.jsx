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
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {group.name}
            </h3>
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${statusClass}`}>
              {group.status}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <i className="fas fa-user-tie w-4 text-gray-400" />
              {group.guide}
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-users w-4 text-gray-400" />
              {group.members.join(", ")}
            </span>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/projects/${group.projectId || group.id || group._id}`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          Details
        </button>
      </div>

      <div className="pt-4 border-t border-gray-50 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
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
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Groups</h2>
          <p className="text-sm text-gray-500">Management for collaborative ventures</p>
        </div>
        <button 
          onClick={() => navigate("/projects/new")}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <i className="fas fa-plus text-indigo-500" /> Create Group
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm italic">Synchronizing groups...</div>
      ) : groups.length === 0 ? (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
          <i className="fas fa-users text-gray-300 text-3xl mb-4" />
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
