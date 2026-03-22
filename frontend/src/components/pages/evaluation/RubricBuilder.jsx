import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RubricBuilder = memo(() => {
  const navigate = useNavigate();
  const [rubric, setRubric] = useState({
    name: 'Project Evaluation Rubric',
    description: 'Rubric for evaluating final year projects',
    levels: [
      {
        id: 1,
        name: 'Excellent',
        description: 'Exceeds expectations',
        points: 4,
      },
      { id: 2, name: 'Good', description: 'Meets expectations', points: 3 },
      {
        id: 3,
        name: 'Satisfactory',
        description: 'Meets minimum requirements',
        points: 2,
      },
      {
        id: 4,
        name: 'Needs Improvement',
        description: 'Below expectations',
        points: 1,
      },
    ],
    criteria: [
      {
        id: 1,
        name: 'Technical Implementation',
        description: 'Quality of technical execution',
      },
      {
        id: 2,
        name: 'Documentation',
        description: 'Completeness of documentation',
      },
      { id: 3, name: 'Presentation', description: 'Quality of presentation' },
    ],
  });

  const [loading, setLoading] = useState(false);

  const addCriterion = useCallback(() => {
    setRubric((prev) => {
      const newId = Math.max(...prev.criteria.map((c) => c.id)) + 1;
      return {
        ...prev,
        criteria: [
          ...prev.criteria,
          {
            id: newId,
            name: 'New Criterion',
            description: 'Criterion description',
          },
        ],
      };
    });
  }, []);

  const removeCriterion = useCallback((id) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((criterion) => criterion.id !== id),
    }));
  }, []);

  const saveRubric = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Rubric saved successfully');
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            ← Back
          </button>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
                Rubric Builder
              </h1>
              <p className='text-slate-600 dark:text-slate-400'>
                Create and customize evaluation rubrics
              </p>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={saveRubric}
                disabled={loading}
                className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                {loading ? 'Saving...' : 'Save Rubric'}
              </button>
              <button className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'>
                Preview
              </button>
            </div>
          </div>
        </div>

        <div className='mb-6 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          {/* Rubric Info */}
          <div className='mb-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Rubric Name
                </label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                  value={rubric.name}
                  onChange={(e) =>
                    setRubric({ ...rubric, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Description
                </label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                  value={rubric.description}
                  onChange={(e) =>
                    setRubric({ ...rubric, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Rubric Table */}
          <div className='mb-8'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                Rubric Criteria
              </h3>
              <button
                onClick={addCriterion}
                className='rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
              >
                Add Criterion
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full border border-slate-300 dark:border-slate-600'>
                <thead>
                  <tr className='bg-slate-100 dark:bg-slate-700'>
                    <th className='border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-300'>
                      Criteria
                    </th>
                    {rubric.levels.map((level) => (
                      <th
                        key={level.id}
                        className='border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-300'
                      >
                        <div>{level.name}</div>
                        <div className='text-xs text-slate-600 dark:text-slate-400'>
                          {level.points} points
                        </div>
                      </th>
                    ))}
                    <th className='border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-300'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rubric.criteria.map((criterion) => (
                    <tr
                      key={criterion.id}
                      className='hover:bg-slate-50 dark:hover:bg-slate-700'
                    >
                      <td className='border border-slate-300 px-4 py-3 dark:border-slate-600'>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {criterion.name}
                        </div>
                        <div className='text-sm text-slate-600 dark:text-slate-400'>
                          {criterion.description}
                        </div>
                      </td>
                      {rubric.levels.map((level) => (
                        <td
                          key={level.id}
                          className='border border-slate-300 px-4 py-3 dark:border-slate-600'
                        >
                          <textarea
                            rows='2'
                            className='w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                            placeholder={`Description for ${criterion.name} at ${level.name} level`}
                          />
                        </td>
                      ))}
                      <td className='border border-slate-300 px-4 py-3 dark:border-slate-600'>
                        <button
                          onClick={() => removeCriterion(criterion.id)}
                          className='text-sm text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300'
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

RubricBuilder.displayName = 'RubricBuilder';

export default RubricBuilder;
