import { useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const TeamDirectory = memo(() => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, membersRes] = await Promise.all([
          api.get("/collaboration/teams").catch(() => ({ data: { data: [] } })),
          api.get("/collaboration/members").catch(() => ({ data: { data: [] } }))
        ]);
        setTeams(teamsRes.data?.data || []);
        setMembers(membersRes.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch team data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Team Directory
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Browse teams and team members
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
            Create Team
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Teams List */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Teams
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-4 text-slate-500">Loading teams...</div>
              ) : teams.length === 0 ? (
                <div className="text-center py-4 text-slate-500">No teams found.</div>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id || team._id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {team.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Lead: {team.lead || (team.leadId ? team.leadId.name : "TBA")}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                        View
                      </button>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div>{team.members || team.memberCount || 0} members</div>
                      <div>{team.projects || team.projectCount || 0} projects</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Team Members
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-4 text-slate-500">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-center py-4 text-slate-500">No members found.</div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id || member._id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-sm"
                  >
                    <div className="flex items-start mb-3">
                      <div className={`w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded-full mr-4 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold overflow-hidden`}>
                        {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : member.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {member.role || "Member"} • {member.team || (member.teamId ? member.teamId.name : "Unassigned")}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {member.email}
                        </div>
                      </div>
                      <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                        Message
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(member.skills || []).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TeamDirectory.displayName = "TeamDirectory";

export default TeamDirectory;
