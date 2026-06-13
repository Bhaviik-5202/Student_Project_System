import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';

const ProjectDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        setError(
          response.message || 'Project specifications not found in registry.'
        );
        toast.error(response.message || 'Failed to load project details');
      }
    } catch (error) {
      setError('Critical system error while retrieving project data.');
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} | Student Project System`;
    }
    return () => {
      document.title = 'Student Project System';
    };
  }, [project]);

  const statusStyles = useMemo(
    () => ({
      Completed:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'In Progress':
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Pending:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      planning:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_progress:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      completed:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    }),
    []
  );

  if (loading) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500' />
        <p className='animate-pulse text-sm font-medium text-gray-400'>
          Synchronizing project directives...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mx-auto max-w-md p-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20'>
          <i className='fas fa-exclamation-triangle text-2xl text-red-500' />
        </div>
        <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
          Registry Error
        </h3>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>{error}</p>
        <button
          onClick={() => navigate('/projects')}
          className='project-btn project-btn-primary px-8'
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  if (!project) return null;

  const canManageProject =
    user?.role === 'admin' || user?.role === 'faculty';

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const res = await projectService.deleteProject(
        project.slug || project.id || project._id
      );
      if (res.success) {
        toast.success('Project deleted successfully');
        navigate('/projects');
      } else {
        toast.error(res.message || 'Unable to delete project');
      }
    } catch (error) {
      toast.error('Unable to delete project');
    }
  };

  return (
    <div className='project-page animate-fade-in'>
      <div className='project-container'>
        <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <button
              onClick={() => navigate('/projects')}
              className='mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400'
            >
              <i className='fas fa-arrow-left' /> Back to Projects
            </button>
            <h1 className='text-3xl font-black text-gray-900 dark:text-white'>
              {project?.title}
            </h1>
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusStyles[project.status] || statusStyles.Pending}`}
              >
                {project.status?.replace('_', ' ')}
              </span>
              <span className='text-xs font-bold text-gray-400'>
                {project.type} {project.classification ? `(${project.classification})` : ''}
              </span>
            </div>
          </div>
          {canManageProject && (
            <div className='flex items-center gap-3'>
              <button
                onClick={() =>
                  navigate(
                    `/projects/${project.slug || project.id || project._id}/edit`
                  )
                }
                className='project-btn project-btn-primary'
              >
                Edit Project
              </button>
              <button
                onClick={handleDeleteProject}
                className='project-btn project-btn-danger'
              >
                Delete Project
              </button>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='project-card-simple pb-8'>
              <h2 className='mb-4 text-xs font-black uppercase tracking-widest text-gray-400'>
                Description
              </h2>
              <div className='leading-relaxed text-gray-600 dark:text-gray-400'>
                {project.abstract || project.description}
              </div>

              {project.objectives && (
                <div className='mt-6 border-t border-gray-50 pt-6 dark:border-slate-700'>
                  <h2 className='mb-4 text-xs font-black uppercase tracking-widest text-gray-400'>
                    Objectives
                  </h2>
                  <p className='text-sm italic'>{project.objectives}</p>
                </div>
              )}
            </div>

            <div className='project-card-simple'>
              <h2 className='mb-6 text-xs font-black uppercase tracking-widest text-gray-400'>
                Execution Status
              </h2>
              <div className='space-y-4'>
                <div className='mb-1 flex items-center justify-between'>
                  <span className='text-[10px] font-black text-gray-400'>
                    PROGRESS
                  </span>
                  <span className='text-sm font-black text-indigo-600'>
                    {project.progress}%
                  </span>
                </div>
                <div className='h-2 w-full rounded-full bg-gray-100 dark:bg-slate-900'>
                  <div
                    className='h-full rounded-full bg-indigo-500 transition-all duration-1000'
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className='mt-6 grid grid-cols-2 gap-4'>
                  <div>
                    <span className='mb-1 block text-[10px] font-black text-gray-400'>
                      START DATE
                    </span>
                    <p className='text-sm font-bold text-gray-900 dark:text-white'>
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className='mb-1 block text-[10px] font-black text-gray-400'>
                      END DATE
                    </span>
                    <p className='text-sm font-bold text-gray-900 dark:text-white'>
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='project-card-simple'>
              <h2 className='mb-4 text-xs font-black uppercase tracking-widest text-gray-400'>
                Project Guide
              </h2>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500 dark:border-slate-700 dark:bg-slate-900'>
                  <i className='fas fa-user-tie' />
                </div>
                <div>
                  <p className='text-sm font-black text-gray-900 dark:text-white'>
                    {project.guide?.name || project.guide || 'Not Assigned'}
                  </p>
                  <p className='text-[10px] font-bold uppercase text-gray-400'>
                    Faculty Mentor
                  </p>
                </div>
              </div>
            </div>

            <div className='project-card-simple'>
              <h2 className='mb-4 text-xs font-black uppercase tracking-widest text-gray-400'>
                Members
              </h2>
              <div className='space-y-3'>
                {Array.isArray(project.members) &&
                project.members.length > 0 ? (
                  project.members.map((member, index) => (
                    <div
                      key={member._id || index}
                      className='flex items-center gap-3'
                    >
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 dark:bg-slate-900'>
                        {member.name?.charAt(0) || 'M'}
                      </div>
                      <span className='text-sm font-bold text-gray-900 dark:text-white'>
                        {member.name ||
                          (typeof member === 'string' ? member : 'Unknown')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className='text-xs italic text-gray-400'>
                    No members assigned
                  </p>
                )}
                {project.teamMembers && (
                  <div className='mt-2 border-t border-gray-50 pt-2 text-xs text-gray-500 dark:border-slate-700'>
                    <strong>Other:</strong> {project.teamMembers}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectDetails.displayName = 'ProjectDetails';
export default ProjectDetails;
