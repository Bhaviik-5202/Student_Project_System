import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import projectService from "../../../services/projectService";
import studentService from "../../../services/studentService";
import useNotification from "../../../hooks/useNotification";

const TeamDirectory = memo(() => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamsRes, membersRes] = await Promise.all([
        projectService.getAllProjects(),
        studentService.getAllStudents()
      ]);
      
      if (teamsRes.data?.success) {
        setTeams(teamsRes.data.data);
      }
      
      if (membersRes.data?.success) {
        setMembers(membersRes.data.data);
      }
    } catch (error) {
      showError("Failed to fetch team data");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Team Directory
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Browse project teams and collaborators
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Teams List (Projects) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Project Teams
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-4 text-slate-500">Loading teams...</div>
              ) : teams.length === 0 ? (
                <div className="text-center py-4 text-slate-500">No projects found.</div>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id || team._id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {team.title}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Guide: {team.guide?.name || "TBA"}
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/projects/${team._id || team.id}`)}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                      >
                        Details
                      </button>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div>{(team.members?.length || 0) + (team.guide ? 1 : 0)} members</div>
                      <div className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded capitalize">
                        {team.status || "Planned"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Collaborators (Students & Staff) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Collaborators
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
                      <div className={`w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold overflow-hidden`}>
                        {(member.name || member.user?.name || "U").charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {member.name || member.user?.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {member.user?.role || "Student"} • {member.department || "General"}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {member.email || member.user?.email}
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate("/chat")}
                        className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        Chat
                      </button>
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
