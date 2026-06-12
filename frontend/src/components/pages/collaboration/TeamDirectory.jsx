import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../../../services/projectService';
import studentService from '../../../services/studentService';
import useNotification from '../../../hooks/useNotification';

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
        studentService.getAllStudents(),
      ]);

      if (teamsRes.data?.success) {
        setTeams(teamsRes.data.data);
      }

      if (membersRes.data?.success) {
        setMembers(membersRes.data.data);
      }
    } catch (error) {
      showError('Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Team Directory
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              Browse project teams and collaborators
            </p>
          </div>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Teams List (Projects) */}
          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Project Teams
            </h3>
            <div className='max-h-[600px] space-y-4 overflow-y-auto pr-2'>
              {loading ? (
                <div className='py-4 text-center text-slate-500'>
                  Loading teams...
                </div>
              ) : teams.length === 0 ? (
                <div className='py-4 text-center text-slate-500'>
                  No projects found.
                </div>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id || team._id}
                    className='rounded-lg border border-slate-200 p-4 hover:shadow-sm dark:border-slate-700'
                  >
                    <div className='mb-3 flex items-start justify-between'>
                      <div>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {team.title}
                        </div>
                        <div className='text-sm text-slate-600 dark:text-slate-400'>
                          Guide: {team.guide?.name || 'TBA'}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/projects/${team._id || team.id}`)
                        }
                        className='rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                      >
                        Details
                      </button>
                    </div>
                    <div className='flex gap-4 text-sm text-slate-600 dark:text-slate-400'>
                      <div>
                        {(team.members?.length || 0) + (team.guide ? 1 : 0)}{' '}
                        members
                      </div>
                      <div className='rounded bg-slate-100 px-2 py-0.5 text-xs capitalize dark:bg-slate-700'>
                        {team.status || 'Planned'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Collaborators (Students & Staff) */}
          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Collaborators
            </h3>
            <div className='max-h-[600px] space-y-4 overflow-y-auto pr-2'>
              {loading ? (
                <div className='py-4 text-center text-slate-500'>
                  Loading members...
                </div>
              ) : members.length === 0 ? (
                <div className='py-4 text-center text-slate-500'>
                  No members found.
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id || member._id}
                    className='rounded-lg border border-slate-200 p-4 hover:shadow-sm dark:border-slate-700'
                  >
                    <div className='mb-3 flex items-start'>
                      <div
                        className={`mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`}
                      >
                        {(member.name || member.user?.name || 'U').charAt(0)}
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {member.name || member.user?.name}
                        </div>
                        <div className='text-sm text-slate-600 dark:text-slate-400'>
                          {member.user?.role || 'Student'} •{' '}
                          {member.department || 'General'}
                        </div>
                        <div className='text-sm text-slate-500 dark:text-slate-400'>
                          {member.email || member.user?.email}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/profile/${member.user?._id || member._id}`)}
                        className='rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                      >
                        Profile
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

TeamDirectory.displayName = 'TeamDirectory';

export default TeamDirectory;
