import React, { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const EvaluationForm = memo(() => {
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState({
    student: "",
    project: "",
    criteria: [
      { name: "Technical Skills", score: 0, maxScore: 20 },
      { name: "Documentation", score: 0, maxScore: 15 },
      { name: "Presentation", score: 0, maxScore: 15 },
      { name: "Teamwork", score: 0, maxScore: 15 },
      { name: "Innovation", score: 0, maxScore: 20 },
      { name: "Timeliness", score: 0, maxScore: 15 },
    ],
    comments: "",
    overallScore: 0,
  });
  const [loading, setLoading] = useState(false);

  const calculateTotal = useCallback(() => {
    setEvaluation(prev => {
      const total = prev.criteria.reduce((sum, item) => sum + item.score, 0);
      return { ...prev, overallScore: total };
    });
  }, []);

  const handleScoreChange = useCallback((index, value) => {
    setEvaluation(prev => {
      const newCriteria = [...prev.criteria];
      newCriteria[index].score = Math.min(
        Math.max(0, value),
        newCriteria[index].maxScore
      );
      return { ...prev, criteria: newCriteria };
    });
    setTimeout(calculateTotal, 0);
  }, [calculateTotal]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("Evaluation submitted successfully");
      setLoading(false);
      navigate("/evaluations");
    }, 1500);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Project Evaluation
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Evaluate student projects and provide feedback
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Student Name
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  value={evaluation.student}
                  onChange={(e) =>
                    setEvaluation({ ...evaluation, student: e.target.value })
                  }
                >
                  <option value="">Select Student</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Robert Johnson">Robert Johnson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project Title
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  value={evaluation.project}
                  onChange={(e) =>
                    setEvaluation({ ...evaluation, project: e.target.value })
                  }
                >
                  <option value="">Select Project</option>
                  <option value="E-Commerce Platform">
                    E-Commerce Platform
                  </option>
                  <option value="Inventory System">Inventory System</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Evaluation Criteria
              </h3>
              <div className="space-y-4">
                {evaluation.criteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {criterion.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Max: {criterion.maxScore} points
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        className="w-20 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        value={criterion.score}
                        onChange={(e) =>
                          handleScoreChange(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                      <span className="text-slate-600 dark:text-slate-400">
                        / {criterion.maxScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Score */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Overall Score
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">Total out of 100 points</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {evaluation.overallScore}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">/ 100</div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Feedback and Comments
              </label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={evaluation.comments}
                onChange={(e) =>
                  setEvaluation({ ...evaluation, comments: e.target.value })
                }
                placeholder="Provide detailed feedback for the student..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Evaluation"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

EvaluationForm.displayName = 'EvaluationForm';

export default EvaluationForm;
