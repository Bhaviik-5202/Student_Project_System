import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

const SelfEvaluation = memo(() => {
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState({
    project: 'Database Design Project',
    criteria: [
      { id: 1, name: 'Technical Skills', rating: 0, comments: '' },
      { id: 2, name: 'Time Management', rating: 0, comments: '' },
      { id: 3, name: 'Teamwork', rating: 0, comments: '' },
      { id: 4, name: 'Communication', rating: 0, comments: '' },
      { id: 5, name: 'Problem Solving', rating: 0, comments: '' },
    ],
    strengths: '',
    improvements: '',
    overall: 0,
  });

  const updateRating = useCallback((id, rating) => {
    setEvaluation((prev) => {
      const newCriteria = prev.criteria.map((criterion) =>
        criterion.id === id ? { ...criterion, rating } : criterion
      );
      const overall =
        newCriteria.reduce((sum, c) => sum + c.rating, 0) / newCriteria.length;
      return { ...prev, criteria: newCriteria, overall };
    });
  }, []);

  const submitEvaluation = useCallback(async () => {
    try {
      await api.post('/evaluations/self', evaluation);
      toast.success('Self-evaluation submitted successfully');
      navigate('/evaluations');
    } catch (error) {
      console.error('Failed to submit self-evaluation', error);
      toast.error(
        error.response?.data?.message || 'Failed to submit self-evaluation'
      );
    }
  }, [evaluation, navigate]);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate('/evaluations')}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            ← Back to Evaluations
          </button>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Self-Evaluation
          </h1>
          <p className='text-slate-600 dark:text-slate-400'>
            Evaluate your own performance and skills
          </p>
        </div>

        <div className='mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <div className='mb-8'>
            <h2 className='mb-2 text-xl font-bold text-slate-900 dark:text-white'>
              {evaluation.project}
            </h2>
            <p className='text-slate-600 dark:text-slate-400'>
              Evaluate your performance on this project
            </p>
          </div>

          <div className='space-y-8'>
            {/* Evaluation Criteria */}
            <div>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Evaluation Criteria
              </h3>
              <div className='space-y-6'>
                {evaluation.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <div>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {criterion.name}
                        </div>
                        <div className='text-sm text-slate-600 dark:text-slate-400'>
                          Rate your performance
                        </div>
                      </div>
                      <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                        {criterion.rating}/5
                      </div>
                    </div>

                    <div className='mb-4'>
                      <div className='mb-2 flex gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type='button'
                            onClick={() => updateRating(criterion.id, star)}
                            className={`text-2xl ${
                              star <= criterion.rating
                                ? 'text-amber-400 dark:text-amber-300'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <div className='flex justify-between text-xs text-slate-500 dark:text-slate-400'>
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div>
                      <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                        Comments
                      </label>
                      <textarea
                        rows='2'
                        className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                        value={criterion.comments}
                        onChange={(e) => {
                          const newCriteria = evaluation.criteria.map((c) =>
                            c.id === criterion.id
                              ? { ...c, comments: e.target.value }
                              : c
                          );
                          setEvaluation({
                            ...evaluation,
                            criteria: newCriteria,
                          });
                        }}
                        placeholder='Explain your rating...'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Rating */}
            <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-lg font-semibold text-slate-900 dark:text-white'>
                    Overall Self-Rating
                  </div>
                  <div className='text-slate-600 dark:text-slate-400'>
                    Average of all criteria ratings
                  </div>
                </div>
                <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                  {evaluation.overall.toFixed(1)}/5
                </div>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Reflection
              </h3>
              <div className='space-y-6'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    What are your key strengths in this project?
                  </label>
                  <textarea
                    rows='3'
                    className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                    value={evaluation.strengths}
                    onChange={(e) =>
                      setEvaluation({
                        ...evaluation,
                        strengths: e.target.value,
                      })
                    }
                    placeholder='List your key strengths and achievements...'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    What areas need improvement?
                  </label>
                  <textarea
                    rows='3'
                    className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                    value={evaluation.improvements}
                    onChange={(e) =>
                      setEvaluation({
                        ...evaluation,
                        improvements: e.target.value,
                      })
                    }
                    placeholder='Identify areas for improvement and growth...'
                  />
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={submitEvaluation}
                className='rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
              >
                Submit Self-Evaluation
              </button>
              <button
                onClick={() => navigate('/evaluations')}
                className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SelfEvaluation.displayName = 'SelfEvaluation';

export default SelfEvaluation;
