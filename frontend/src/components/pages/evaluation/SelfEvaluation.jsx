import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SelfEvaluation = () => {
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState({
    project: "Database Design Project",
    criteria: [
      { id: 1, name: "Technical Skills", rating: 0, comments: "" },
      { id: 2, name: "Time Management", rating: 0, comments: "" },
      { id: 3, name: "Teamwork", rating: 0, comments: "" },
      { id: 4, name: "Communication", rating: 0, comments: "" },
      { id: 5, name: "Problem Solving", rating: 0, comments: "" },
    ],
    strengths: "",
    improvements: "",
    overall: 0,
  });

  const updateRating = (id, rating) => {
    const newCriteria = evaluation.criteria.map((criterion) =>
      criterion.id === id ? { ...criterion, rating } : criterion
    );
    const overall =
      newCriteria.reduce((sum, c) => sum + c.rating, 0) / newCriteria.length;
    setEvaluation({ ...evaluation, criteria: newCriteria, overall });
  };

  const submitEvaluation = () => {
    toast.success("Self-evaluation submitted successfully");
    navigate("/evaluation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/evaluation")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Evaluation
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Self-Evaluation</h1>
          <p className="text-gray-600">
            Evaluate your own performance and skills
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {evaluation.project}
            </h2>
            <p className="text-gray-600">
              Evaluate your performance on this project
            </p>
          </div>

          <div className="space-y-8">
            {/* Evaluation Criteria */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Evaluation Criteria
              </h3>
              <div className="space-y-6">
                {evaluation.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {criterion.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Rate your performance
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {criterion.rating}/5
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateRating(criterion.id, star)}
                            className={`text-2xl ${
                              star <= criterion.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comments
                      </label>
                      <textarea
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                        placeholder="Explain your rating..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Rating */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Overall Self-Rating
                  </div>
                  <div className="text-gray-600">
                    Average of all criteria ratings
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {evaluation.overall.toFixed(1)}/5
                </div>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reflection
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your key strengths in this project?
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={evaluation.strengths}
                    onChange={(e) =>
                      setEvaluation({
                        ...evaluation,
                        strengths: e.target.value,
                      })
                    }
                    placeholder="List your key strengths and achievements..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What areas need improvement?
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={evaluation.improvements}
                    onChange={(e) =>
                      setEvaluation({
                        ...evaluation,
                        improvements: e.target.value,
                      })
                    }
                    placeholder="Identify areas for improvement and growth..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitEvaluation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Self-Evaluation
              </button>
              <button
                onClick={() => navigate("/evaluation")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfEvaluation;
