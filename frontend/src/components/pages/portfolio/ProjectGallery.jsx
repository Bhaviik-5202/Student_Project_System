import React, { useState, useMemo, useCallback, useEffect } from 'react';
import api from '../../../utils/api';

const ProjectGallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([
    { id: 'all', name: 'All Projects', count: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/portfolio/gallery');
        const data = response.data || {};
        if (data.projects) setProjects(data.projects);
        if (data.filters)
          setFilters([
            {
              id: 'all',
              name: 'All Projects',
              count: data.projects?.length || 0,
            },
            ...data.filters,
          ]);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (filter === 'all') return true;
        return project.category === filter || project.status === filter;
      }),
    [projects, filter]
  );

  if (loading)
    return (
      <div className='p-20 text-center text-sm italic text-gray-400'>
        Synchronizing gallery...
      </div>
    );

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            Project Gallery
          </h2>
          <p className='text-sm text-gray-500'>
            Exhibition of institutional innovations
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex rounded-lg bg-gray-100 p-1 dark:bg-slate-800'>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-2 transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-gray-400'}`}
            >
              <i className='fas fa-th-large text-xs'></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-2 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-gray-400'}`}
            >
              <i className='fas fa-list text-xs'></i>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Filtering */}
      <div className='flex flex-wrap gap-2'>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
              filter === f.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'border border-gray-100 bg-white text-gray-500 hover:border-gray-200'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {viewMode === 'grid' ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredProjects.map((project) => (
            <div
              key={project.id || project._id}
              className='group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800'
              onClick={() => setSelectedProject(project)}
            >
              <div className='relative flex h-40 items-center justify-center overflow-hidden bg-gray-50 dark:bg-slate-900'>
                <i className='fas fa-project-diagram text-4xl text-gray-200 transition-transform duration-500 group-hover:scale-110' />
                <div className='absolute right-3 top-3'>
                  <span className='rounded bg-white/90 px-2 py-0.5 text-[8px] font-bold uppercase text-gray-900 backdrop-blur'>
                    {project.category}
                  </span>
                </div>
              </div>
              <div className='p-5'>
                <h3 className='mb-2 text-sm font-bold leading-tight text-gray-900 dark:text-white'>
                  {project.title}
                </h3>
                <p className='mb-4 line-clamp-2 text-[11px] leading-relaxed text-gray-500'>
                  {project.description}
                </p>
                <div className='flex items-center justify-between border-t border-gray-50 pt-4 dark:border-slate-700'>
                  <div className='flex gap-1'>
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className='rounded bg-gray-50 px-2 py-0.5 text-[8px] font-bold uppercase text-gray-400 dark:bg-slate-900'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className='text-[9px] font-bold uppercase tracking-tighter text-gray-400'>
                    {project.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='divide-y divide-gray-50 rounded-xl border border-gray-200 bg-white shadow-sm dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800'>
          {filteredProjects.map((project) => (
            <div
              key={project.id || project._id}
              className='flex cursor-pointer items-center justify-between p-5 transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-900/30'
              onClick={() => setSelectedProject(project)}
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-900'>
                  <i className='fas fa-cube text-xs text-gray-300' />
                </div>
                <div>
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white'>
                    {project.title}
                  </h4>
                  <p className='mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                    {project.category} • {project.date}
                  </p>
                </div>
              </div>
              <button className='text-[10px] font-bold uppercase text-indigo-600'>
                Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className='rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-24 text-center dark:border-slate-800 dark:bg-slate-900/50'>
          <i className='fas fa-folder-open mb-4 text-3xl text-gray-300' />
          <h3 className='text-sm font-bold text-gray-900 dark:text-white'>
            Gallery Empty
          </h3>
          <p className='mt-1 text-[10px] uppercase tracking-widest text-gray-500'>
            No ventures match the selected criteria
          </p>
        </div>
      )}

      {/* Detail Showcase Overlay */}
      {selectedProject && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm'>
          <div className='animate-in fade-in zoom-in w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-300 dark:bg-slate-800'>
            <div className='p-8'>
              <div className='mb-6 flex items-start justify-between'>
                <div>
                  <h2 className='text-xl font-bold leading-tight text-gray-900 dark:text-white'>
                    {selectedProject.title}
                  </h2>
                  <div className='mt-2 flex items-center gap-3'>
                    <span className='rounded bg-indigo-50 px-2 py-0.5 text-[8px] font-bold uppercase text-indigo-700'>
                      {selectedProject.status}
                    </span>
                    <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                      {selectedProject.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className='rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100'
                >
                  <i className='fas fa-times' />
                </button>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>
                    Conceptual Blueprint
                  </h3>
                  <p className='text-xs leading-relaxed text-gray-600 dark:text-gray-300'>
                    {selectedProject.description}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-8'>
                  <div>
                    <h3 className='mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>
                      Stack Architecture
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className='rounded border border-gray-100 bg-gray-50 px-2.5 py-1 text-[9px] font-bold text-gray-500 dark:border-slate-700 dark:bg-slate-900'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className='mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>
                      Core Team
                    </h3>
                    <div className='space-y-2'>
                      {selectedProject.team.map((member) => (
                        <div key={member} className='flex items-center gap-2'>
                          <div className='flex h-5 w-5 items-center justify-center rounded bg-indigo-100'>
                            <i className='fas fa-user text-[8px] text-indigo-500' />
                          </div>
                          <span className='text-[11px] font-bold text-gray-700 dark:text-gray-200'>
                            {member}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-3 bg-gray-50 p-6 dark:bg-slate-900/50'>
              <button className='flex-1 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700'>
                Launch Application
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className='rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-xs font-bold text-gray-500 transition-all hover:bg-gray-50'
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProjectGallery.displayName = 'ProjectGallery';
export default React.memo(ProjectGallery);
