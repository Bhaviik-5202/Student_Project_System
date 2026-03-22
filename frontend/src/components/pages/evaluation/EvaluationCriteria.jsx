import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EvaluationCriteria = memo(() => {
  const navigate = useNavigate();

  const criteriaSets = useMemo(
    () => [
      { id: 1, name: 'Project Evaluation', criteria: 6, used: 12 },
      { id: 2, name: 'Assignment Rubric', criteria: 5, used: 24 },
      { id: 3, name: 'Presentation Scoring', criteria: 4, used: 8 },
    ],
    []
  );

  const currentSet = useMemo(
    () => ({
      name: 'Project Evaluation',
      criteria: [
        {
          id: 1,
          name: 'Technical Implementation',
          weight: 30,
          description: 'Quality of code and technical execution',
        },
        {
          id: 2,
          name: 'Documentation',
          weight: 20,
          description: 'Completeness and clarity of documentation',
        },
        {
          id: 3,
          name: 'Presentation',
          weight: 15,
          description: 'Quality of presentation and delivery',
        },
        {
          id: 4,
          name: 'Teamwork',
          weight: 15,
          description: 'Collaboration and team contribution',
        },
        {
          id: 5,
          name: 'Innovation',
          weight: 20,
          description: 'Creativity and innovation in solution',
        },
      ],
    }),
    []
  );

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Evaluation Criteria
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              Manage evaluation criteria and rubrics
            </p>
          </div>
          <button className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
            New Criteria Set
          </button>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Criteria Sets */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Criteria Sets
              </h3>
              <div className='space-y-4'>
                {criteriaSets.map((set) => (
                  <div
                    key={set.id}
                    className='rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-sm dark:border-slate-700 dark:hover:shadow-md'
                  >
                    <div className='mb-2 font-medium text-slate-900 dark:text-white'>
                      {set.name}
                    </div>
                    <div className='flex justify-between text-sm text-slate-600 dark:text-slate-400'>
                      <span>{set.criteria} criteria</span>
                      <span>Used {set.used} times</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Criteria Details */}
          <div className='lg:col-span-2'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                  {currentSet.name}
                </h3>
                <button className='rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
                  Edit Criteria
                </button>
              </div>

              <div className='space-y-4'>
                {currentSet.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'
                  >
                    <div className='mb-3 flex items-start justify-between'>
                      <div>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {criterion.name}
                        </div>
                        <div className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                          {criterion.description}
                        </div>
                      </div>
                      <div className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                        {criterion.weight}%
                      </div>
                    </div>

                    <div className='flex items-center text-sm text-slate-600 dark:text-slate-400'>
                      <span className='mr-4'>Weight: {criterion.weight}%</span>
                      <div className='h-2 w-32 rounded-full bg-slate-200 dark:bg-slate-700'>
                        <div
                          className='h-2 rounded-full bg-blue-500 dark:bg-blue-400'
                          style={{ width: `${criterion.weight}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-lg font-semibold text-slate-900 dark:text-white'>
                        Total Weight
                      </div>
                      <div className='text-slate-600 dark:text-slate-400'>
                        Sum of all criteria weights
                      </div>
                    </div>
                    <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                      {currentSet.criteria.reduce(
                        (sum, c) => sum + c.weight,
                        0
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EvaluationCriteria.displayName = 'EvaluationCriteria';

export default EvaluationCriteria;
