// src/components/pages/dashboard/ProgressVisualization.jsx
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const MilestoneMarker = memo(({ milestone, projectProgress }) => (
  <div key={milestone} className='flex flex-col items-center'>
    <div
      className={`h-1 w-1 rounded-full ${
        projectProgress >= milestone
          ? 'bg-slate-600 dark:bg-slate-300'
          : 'bg-slate-300 dark:bg-slate-600'
      }`}
    />
    <span className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
      {milestone}%
    </span>
  </div>
));

MilestoneMarker.displayName = 'MilestoneMarker';

MilestoneMarker.propTypes = {
  milestone: PropTypes.number.isRequired,
  projectProgress: PropTypes.number.isRequired,
};

const getColorClass = (color) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    purple: 'bg-purple-500',
  };
  return colorMap[color] || 'bg-blue-500';
};

const ProgressVisualization = memo(
  ({ projects = [], userRole = 'student' }) => {
    return (
      <div className='space-y-6'>
        {projects && projects.length > 0 ? (
          projects
            .filter((project) => project && (project.name || project.title))
            .map((project, index) => (
              <div key={index} className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div
                      className={`mr-3 h-3 w-3 rounded-full ${getColorClass(
                        project.color
                      )}`}
                    />
                    <div>
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {project.name || project.title}
                      </div>
                      <div className='text-sm text-slate-500 dark:text-slate-400'>
                        {userRole === 'student'
                          ? project.status || 'In Progress'
                          : `${project.students || 0} students`}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <span className='mr-3 font-bold text-slate-900 dark:text-white'>
                      {project.progress || 0}%
                    </span>
                    {project.progress === 100 && (
                      <span className='rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'>
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className='relative'>
                  <div className='h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
                    <div
                      className={`h-3 rounded-full ${getColorClass(
                        project.color
                      )} transition-all duration-500`}
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>

                  {/* Milestone markers */}
                  <div className='mt-1 flex justify-between'>
                    {[0, 25, 50, 75, 100].map((milestone) => (
                      <MilestoneMarker
                        key={milestone}
                        milestone={milestone}
                        projectProgress={project.progress || 0}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className='py-8 text-center text-slate-500 dark:text-slate-400'>
            No project progress data found.
          </div>
        )}
      </div>
    );
  }
);

ProgressVisualization.displayName = 'ProgressVisualization';

ProgressVisualization.propTypes = {
  userRole: PropTypes.oneOf(['student', 'faculty', 'admin']),
};

export default ProgressVisualization;
