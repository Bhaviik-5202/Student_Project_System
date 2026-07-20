import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';

const ProjectCard = memo(({ project, onNavigate, currentUser }) => {
  const canEdit =
    currentUser?.role === 'admin' || currentUser?.role === 'faculty';
  const statusStyles = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  const badgeClass = statusStyles[project.statusColor] || statusStyles.blue;

  return (
    <div className='project-card-simple'>
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div className='flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <h3 className='text-lg font-bold leading-tight text-gray-900 dark:text-white'>
              {project.title}
            </h3>
            <span className={`project-badge ${badgeClass}`}>
              {project.status}
            </span>
          </div>
          <p className='line-clamp-2 text-sm text-gray-500'>
            {project.description}
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() =>
              onNavigate(
                `/projects/${project.slug || project.id || project._id}`
              )
            }
            className='project-btn project-btn-primary'
          >
            Details
          </button>
          {canEdit && (
            <button
              onClick={() =>
                onNavigate(
                  `/projects/${project.slug || project.id || project._id}/edit`
                )
              }
              className='project-btn project-btn-secondary'
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 dark:border-slate-700 sm:grid-cols-4'>
        <div>
          <p className='mb-1 text-[10px] font-bold text-gray-400'>Guide</p>
          <p className='truncate text-sm font-semibold text-gray-900 dark:text-white'>
            {project.guide?.name ||
              (typeof project.guide === 'string'
                ? project.guide
                : 'Not Assigned')}
          </p>
        </div>
        <div>
          <p className='mb-1 text-[10px] font-bold text-gray-400'>Start Date</p>
          <p className='text-sm font-semibold text-gray-900 dark:text-white'>
            {project.startDate
              ? new Date(project.startDate).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
        <div>
          <p className='mb-1 text-[10px] font-bold text-gray-400'>Progress</p>
          <div className='flex items-center gap-2'>
            <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-900'>
              <div
                className='h-full rounded-full bg-indigo-500'
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className='text-xs font-bold text-gray-900 dark:text-white'>
              {project.progress}%
            </span>
          </div>
        </div>
        <div>
          <p className='mb-1 text-[10px] font-bold text-gray-400'>Deadline</p>
          <p className='text-sm font-semibold text-gray-900 dark:text-white'>
            {project.endDate
              ? new Date(project.endDate).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const ProjectList = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      const res = await projectService.getAllProjects();
      if (res.success) {
        setProjects(res.data || []);
      } else {
        setError(res.message || 'Failed to load projects');
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className='project-page animate-fade-in text-gray-600 dark:text-gray-400'>
      <div className='project-header'>
        <div>
          <h2 className='project-title text-gray-900 dark:text-white'>
            Project Catalog
          </h2>
          <p className='project-subtitle'>Track milestones and deliverables</p>
        </div>
        {user?.role !== 'student' && (
          <button
            onClick={() => navigate('/projects/new')}
            className='project-btn project-btn-primary'
          >
            New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className='py-20 text-center text-sm italic text-gray-400'>
          Accessing project archives...
        </div>
      ) : error ? (
        <div className='rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-bold text-red-600'>
          {error}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4'>
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id || project._id}
                project={project}
                onNavigate={navigate}
                currentUser={user}
              />
            ))
          ) : (
            <div className='rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='font-bold text-gray-900 dark:text-white'>
                No Projects Found
              </h3>
              <p className='mx-auto mt-1 max-w-[200px] text-xs leading-relaxed text-gray-500'>
                No active projects found in your registry. Start by proposing a
                new one.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProjectList.displayName = 'ProjectList';
export default ProjectList;
