import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const GradingRubric = () => {
  const navigate = useNavigate();
  const [rubric, setRubric] = useState({
    name: "Project Evaluation Rubric",
    criteria: [
      {
        id: 1,
        criterion: "Technical Implementation",
        maxPoints: 30,
        description: "Quality of code and technical execution",
      },
      {
        id: 2,
        criterion: "Documentation",
        maxPoints: 20,
        description: "Completeness and clarity of documentation",
      },
      {
        id: 3,
        criterion: "Presentation",
        maxPoints: 15,
        description: "Quality of presentation and delivery",
      },
      {
        id: 4,
        criterion: "Teamwork",
        maxPoints: 15,
        description: "Collaboration and team contribution",
      },
      {
        id: 5,
        criterion: "Innovation",
        maxPoints: 20,
        description: "Creativity and innovation in solution",
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const updateCriterion = (id, field, value) => {
    setRubric({
      ...rubric,
      criteria: rubric.criteria.map((criterion) =>
        criterion.id === id ? { ...criterion, [field]: value } : criterion
      ),
    });
  };

  const addCriterion = () => {
    const newId = Math.max(...rubric.criteria.map((c) => c.id)) + 1;
    setRubric({
      ...rubric,
      criteria: [
        ...rubric.criteria,
        {
          id: newId,
          criterion: "New Criterion",
          maxPoints: 10,
          description: "Criterion description",
        },
      ],
    });
  };

  const removeCriterion = (id) => {
    setRubric({
      ...rubric,
      criteria: rubric.criteria.filter((criterion) => criterion.id !== id),
    });
  };

  const saveRubric = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Rubric saved successfully");
      setLoading(false);
    }, 1000);
  };

  const totalPoints = rubric.criteria.reduce(
    (sum, criterion) => sum + criterion.maxPoints,
    0
  );

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Grading Rubric
              </h1>
              <p className="text-gray-600">Create and manage grading rubrics</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveRubric}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Rubric"}
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rubric Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rubric.name}
              onChange={(e) => setRubric({ ...rubric, name: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Rubric Criteria
              </h3>
              <button
                onClick={addCriterion}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                Add Criterion
              </button>
            </div>

            <div className="space-y-4">
              {rubric.criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        value={criterion.criterion}
                        onChange={(e) =>
                          updateCriterion(
                            criterion.id,
                            "criterion",
                            e.target.value
                          )
                        }
                      />
                      <textarea
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={criterion.description}
                        onChange={(e) =>
                          updateCriterion(
                            criterion.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Criterion description"
                      />
                    </div>
                    <div className="ml-4 flex items-start">
                      <div className="mr-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Points
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={criterion.maxPoints}
                          onChange={(e) =>
                            updateCriterion(
                              criterion.id,
                              "maxPoints",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeCriterion(criterion.id)}
                        className="text-red-600 hover:text-red-800 mt-7"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Total Points
                </div>
                <div className="text-gray-600">Sum of all criteria points</div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {totalPoints}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingRubric;
