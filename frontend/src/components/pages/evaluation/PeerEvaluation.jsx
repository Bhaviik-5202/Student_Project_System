// src/components/pages/evaluation/PeerEvaluation.jsx
import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-hot-toast';

const PeerEvaluation = memo(() => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await api.get('/evaluations/peer');
        setEvaluations(response.data || []);
      } catch (error) {
        console.error('Failed to fetch peer evaluations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const updateScore = useCallback((evalId, critIndex, newScore) => {
    setEvaluations((prevEvaluations) =>
      prevEvaluations.map((e) => {
        if (e.id === evalId) {
          const updatedCriteria = [...e.criteria];
          updatedCriteria[critIndex] = {
            ...updatedCriteria[critIndex],
            score: Math.min(Math.max(1, newScore), 5),
          };
          return { ...e, criteria: updatedCriteria };
        }
        return e;
      })
    );
  }, []);

  const updateComments = useCallback((evalId, comments) => {
    setEvaluations((prevEvaluations) =>
      prevEvaluations.map((e) => (e.id === evalId ? { ...e, comments } : e))
    );
  }, []);

  const submitEvaluation = useCallback(
    async (evalId) => {
      try {
        const evaluationData = evaluations.find(
          (e) => e.id === evalId || e._id === evalId
        );
        await api.post(`/evaluations/peer/${evalId || ''}`, evaluationData);
        toast.success('Evaluation submitted successfully');
        setEvaluations((prevEvaluations) =>
          prevEvaluations.map((e) =>
            e.id === evalId || e._id === evalId ? { ...e, submitted: true } : e
          )
        );
      } catch (error) {
        console.error('Failed to submit peer evaluation', error);
        toast.error(
          error.response?.data?.message || 'Failed to submit evaluation'
        );
      }
    },
    [evaluations]
  );

  const submittedCount = useMemo(
    () => evaluations.filter((e) => e.submitted).length,
    [evaluations]
  );

  const progressPercentage = useMemo(
    () => (submittedCount / evaluations.length) * 100,
    [submittedCount, evaluations.length]
  );

  return (
    <div className='min-h-screen bg-slate-50 p-6 dark:bg-slate-900'>
      <div className='mb-6'>
        <h1 className='mb-2 text-2xl font-bold text-slate-900 dark:text-white'>
          Peer Evaluation
        </h1>
        <p className='text-slate-600 dark:text-slate-400'>
          Evaluate your team members for the current project
        </p>
      </div>

      {/* Progress Summary */}
      <div className='mb-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
              Evaluation Progress
            </h3>
            <p className='text-slate-600 dark:text-slate-400'>
              Complete evaluations for all team members
            </p>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {submittedCount}/{evaluations.length}
            </div>
            <div className='text-sm text-slate-600 dark:text-slate-400'>
              Submitted
            </div>
          </div>
        </div>
        <div className='mt-4'>
          <div className='h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
            <div
              className='h-2 rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500'
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Evaluation Forms */}
      <div className='max-h-[800px] space-y-6 overflow-y-auto pr-2'>
        {loading ? (
          <div className='py-8 text-center text-slate-500'>
            Loading evaluations...
          </div>
        ) : evaluations.length === 0 ? (
          <div className='py-8 text-center text-slate-500'>
            No pending evaluations found.
          </div>
        ) : (
          evaluations.map((evaluation) => (
            <div
              key={evaluation.id || evaluation._id}
              className='overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
            >
              <div className='border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900'>
                      <i className='fas fa-user text-blue-600 dark:text-blue-400'></i>
                    </div>
                    <div>
                      <h3 className='font-medium text-slate-900 dark:text-white'>
                        {evaluation.peer}
                      </h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        {evaluation.role}
                      </p>
                    </div>
                  </div>
                  <div>
                    {evaluation.submitted ? (
                      <span className='rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'>
                        <i className='fas fa-check mr-1'></i> Submitted
                      </span>
                    ) : (
                      <span className='rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200'>
                        <i className='fas fa-clock mr-1'></i> Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='p-6'>
                {/* Evaluation Criteria */}
                <div className='mb-6'>
                  <h4 className='mb-4 font-medium text-slate-900 dark:text-white'>
                    Evaluation Criteria
                  </h4>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {evaluation.criteria.map((criterion, index) => (
                      <div
                        key={index}
                        className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50'
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <span className='font-medium text-slate-900 dark:text-white'>
                            {criterion.name}
                          </span>
                          <span className='font-bold text-blue-600 dark:text-blue-400'>
                            {criterion.score}/{criterion.max}
                          </span>
                        </div>
                        {!evaluation.submitted && (
                          <div className='flex space-x-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  updateScore(evaluation.id, index, star)
                                }
                                className={`text-lg ${
                                  star <= criterion.score
                                    ? 'text-amber-400 dark:text-amber-300'
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                                disabled={evaluation.submitted}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div className='mb-6'>
                  <h4 className='mb-3 font-medium text-slate-900 dark:text-white'>
                    Comments & Feedback
                  </h4>
                  <textarea
                    value={evaluation.comments}
                    onChange={(e) =>
                      updateComments(evaluation.id, e.target.value)
                    }
                    placeholder='Provide constructive feedback for your team member...'
                    className='min-h-[100px] w-full rounded-lg border border-slate-300 bg-white p-4 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
                    disabled={evaluation.submitted}
                  />
                </div>

                {/* Submit Button */}
                {!evaluation.submitted && (
                  <div className='flex justify-end'>
                    <button
                      onClick={() =>
                        submitEvaluation(evaluation.id || evaluation._id)
                      }
                      className='rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                    >
                      Submit Evaluation
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Evaluation Guidelines */}
      <div className='mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800'>
        <h3 className='mb-3 font-medium text-slate-900 dark:text-white'>
          Evaluation Guidelines
        </h3>
        <ul className='space-y-2 text-slate-600 dark:text-slate-400'>
          <li className='flex items-start'>
            <i className='fas fa-check mr-3 mt-1 text-emerald-500 dark:text-emerald-400'></i>
            <span>Be honest and objective in your assessments</span>
          </li>
          <li className='flex items-start'>
            <i className='fas fa-check mr-3 mt-1 text-emerald-500 dark:text-emerald-400'></i>
            <span>
              Provide constructive feedback to help team members improve
            </span>
          </li>
          <li className='flex items-start'>
            <i className='fas fa-check mr-3 mt-1 text-emerald-500 dark:text-emerald-400'></i>
            <span>Focus on specific examples and observations</span>
          </li>
          <li className='flex items-start'>
            <i className='fas fa-check mr-3 mt-1 text-emerald-500 dark:text-emerald-400'></i>
            <span>All evaluations are confidential and anonymous</span>
          </li>
        </ul>
      </div>
    </div>
  );
});

PeerEvaluation.displayName = 'PeerEvaluation';

export default PeerEvaluation;
