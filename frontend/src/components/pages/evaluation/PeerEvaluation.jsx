// src/components/pages/evaluation/PeerEvaluation.jsx
import React, { memo, useState, useCallback, useMemo } from "react";

const PeerEvaluation = memo(() => {
  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      peer: "Alex Johnson",
      role: "Team Lead",
      criteria: [
        { name: "Communication", score: 4, max: 5 },
        { name: "Technical Skills", score: 5, max: 5 },
        { name: "Teamwork", score: 4, max: 5 },
        { name: "Deadline Adherence", score: 3, max: 5 },
      ],
      comments:
        "Excellent leadership skills, could improve on time management.",
      submitted: true,
    },
    {
      id: 2,
      peer: "Sarah Miller",
      role: "Backend Developer",
      criteria: [
        { name: "Communication", score: 3, max: 5 },
        { name: "Technical Skills", score: 5, max: 5 },
        { name: "Teamwork", score: 4, max: 5 },
        { name: "Deadline Adherence", score: 5, max: 5 },
      ],
      comments: "",
      submitted: false,
    },
    {
      id: 3,
      peer: "Mike Chen",
      role: "Database Admin",
      criteria: [
        { name: "Communication", score: 2, max: 5 },
        { name: "Technical Skills", score: 4, max: 5 },
        { name: "Teamwork", score: 3, max: 5 },
        { name: "Deadline Adherence", score: 4, max: 5 },
      ],
      comments: "",
      submitted: false,
    },
  ]);

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
      }),
    );
  }, []);

  const updateComments = useCallback((evalId, comments) => {
    setEvaluations((prevEvaluations) =>
      prevEvaluations.map((e) => (e.id === evalId ? { ...e, comments } : e)),
    );
  }, []);

  const submitEvaluation = useCallback((evalId) => {
    setEvaluations((prevEvaluations) =>
      prevEvaluations.map((e) =>
        e.id === evalId ? { ...e, submitted: true } : e,
      ),
    );
  }, []);

  const submittedCount = useMemo(
    () => evaluations.filter((e) => e.submitted).length,
    [evaluations],
  );

  const progressPercentage = useMemo(
    () => (submittedCount / evaluations.length) * 100,
    [submittedCount, evaluations.length],
  );

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Peer Evaluation
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Evaluate your team members for the current project
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Evaluation Progress
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Complete evaluations for all team members
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {submittedCount}/{evaluations.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Submitted
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Evaluation Forms */}
      <div className="space-y-6">
        {evaluations.map((evaluation) => (
          <div
            key={evaluation.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-slate-700 p-4 border-b border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-user text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {evaluation.peer}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {evaluation.role}
                    </p>
                  </div>
                </div>
                <div>
                  {evaluation.submitted ? (
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium">
                      <i className="fas fa-check mr-1"></i> Submitted
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium">
                      <i className="fas fa-clock mr-1"></i> Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Evaluation Criteria */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 dark:text-white mb-4">
                  Evaluation Criteria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluation.criteria.map((criterion, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {criterion.name}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {criterion.score}/{criterion.max}
                        </span>
                      </div>
                      {!evaluation.submitted && (
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                updateScore(evaluation.id, index, star)
                              }
                              className={`text-lg ${
                                star <= criterion.score
                                  ? "text-amber-400 dark:text-amber-300"
                                  : "text-slate-300 dark:text-slate-600"
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
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                  Comments & Feedback
                </h4>
                <textarea
                  value={evaluation.comments}
                  onChange={(e) =>
                    updateComments(evaluation.id, e.target.value)
                  }
                  placeholder="Provide constructive feedback for your team member..."
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  disabled={evaluation.submitted}
                />
              </div>

              {/* Submit Button */}
              {!evaluation.submitted && (
                <div className="flex justify-end">
                  <button
                    onClick={() => submitEvaluation(evaluation.id)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 font-medium"
                  >
                    Submit Evaluation
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Guidelines */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="font-medium text-slate-900 dark:text-white mb-3">
          Evaluation Guidelines
        </h3>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li className="flex items-start">
            <i className="fas fa-check text-emerald-500 dark:text-emerald-400 mt-1 mr-3"></i>
            <span>Be honest and objective in your assessments</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-emerald-500 dark:text-emerald-400 mt-1 mr-3"></i>
            <span>
              Provide constructive feedback to help team members improve
            </span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-emerald-500 dark:text-emerald-400 mt-1 mr-3"></i>
            <span>Focus on specific examples and observations</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-emerald-500 dark:text-emerald-400 mt-1 mr-3"></i>
            <span>All evaluations are confidential and anonymous</span>
          </li>
        </ul>
      </div>
    </div>
  );
});

PeerEvaluation.displayName = "PeerEvaluation";

export default PeerEvaluation;
