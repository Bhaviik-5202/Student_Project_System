import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const RubricBuilder = () => {
  const navigate = useNavigate();
  const [rubric, setRubric] = useState({
    name: "Project Evaluation Rubric",
    description: "Rubric for evaluating final year projects",
    levels: [
      {
        id: 1,
        name: "Excellent",
        description: "Exceeds expectations",
        points: 4,
      },
      { id: 2, name: "Good", description: "Meets expectations", points: 3 },
      {
        id: 3,
        name: "Satisfactory",
        description: "Meets minimum requirements",
        points: 2,
      },
      {
        id: 4,
        name: "Needs Improvement",
        description: "Below expectations",
        points: 1,
      },
    ],
    criteria: [
      {
        id: 1,
        name: "Technical Implementation",
        description: "Quality of technical execution",
      },
      {
        id: 2,
        name: "Documentation",
        description: "Completeness of documentation",
      },
      { id: 3, name: "Presentation", description: "Quality of presentation" },
    ],
  });

  const [loading, setLoading] = useState(false);

  const addCriterion = () => {
    const newId = Math.max(...rubric.criteria.map((c) => c.id)) + 1;
    setRubric({
      ...rubric,
      criteria: [
        ...rubric.criteria,
        {
          id: newId,
          name: "New Criterion",
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
                Rubric Builder
              </h1>
              <p className="text-gray-600">
                Create and customize evaluation rubrics
              </p>
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
                Preview
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {/* Rubric Info */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rubric Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rubric.name}
                  onChange={(e) =>
                    setRubric({ ...rubric, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rubric.description}
                  onChange={(e) =>
                    setRubric({ ...rubric, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Rubric Table */}
          <div className="mb-8">
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

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Criteria
                    </th>
                    {rubric.levels.map((level) => (
                      <th
                        key={level.id}
                        className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700"
                      >
                        <div>{level.name}</div>
                        <div className="text-xs text-gray-600">
                          {level.points} points
                        </div>
                      </th>
                    ))}
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rubric.criteria.map((criterion) => (
                    <tr key={criterion.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {criterion.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {criterion.description}
                        </div>
                      </td>
                      {rubric.levels.map((level) => (
                        <td
                          key={level.id}
                          className="border border-gray-300 px-4 py-3"
                        >
                          <textarea
                            rows="2"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder={`Description for ${criterion.name} at ${level.name} level`}
                          />
                        </td>
                      ))}
                      <td className="border border-gray-300 px-4 py-3">
                        <button
                          onClick={() => removeCriterion(criterion.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
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
};

export default RubricBuilder;
