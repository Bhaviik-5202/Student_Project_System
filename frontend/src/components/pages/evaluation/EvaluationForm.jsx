import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const EvaluationForm = () => {
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

  const calculateTotal = () => {
    const total = evaluation.criteria.reduce(
      (sum, item) => sum + item.score,
      0
    );
    setEvaluation({ ...evaluation, overallScore: total });
  };

  const handleScoreChange = (index, value) => {
    const newCriteria = [...evaluation.criteria];
    newCriteria[index].score = Math.min(
      Math.max(0, value),
      newCriteria[index].maxScore
    );
    setEvaluation({ ...evaluation, criteria: newCriteria });
    setTimeout(calculateTotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("Evaluation submitted successfully");
      setLoading(false);
      navigate("/evaluations");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Project Evaluation
          </h1>
          <p className="text-gray-600">
            Evaluate student projects and provide feedback
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Evaluation Criteria
              </h3>
              <div className="space-y-4">
                {evaluation.criteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {criterion.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Max: {criterion.maxScore} points
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={criterion.score}
                        onChange={(e) =>
                          handleScoreChange(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                      <span className="text-gray-600">
                        / {criterion.maxScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Score */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Overall Score
                  </h4>
                  <p className="text-gray-600">Total out of 100 points</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {evaluation.overallScore}
                  </div>
                  <div className="text-gray-600">/ 100</div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback and Comments
              </label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Evaluation"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;
