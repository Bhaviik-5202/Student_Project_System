import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const EvaluationCriteria = () => {
  const navigate = useNavigate();
  const [criteriaSets] = useState([
    { id: 1, name: "Project Evaluation", criteria: 6, used: 12 },
    { id: 2, name: "Assignment Rubric", criteria: 5, used: 24 },
    { id: 3, name: "Presentation Scoring", criteria: 4, used: 8 },
  ]);

  const [currentSet] = useState({
    name: "Project Evaluation",
    criteria: [
      {
        id: 1,
        name: "Technical Implementation",
        weight: 30,
        description: "Quality of code and technical execution",
      },
      {
        id: 2,
        name: "Documentation",
        weight: 20,
        description: "Completeness and clarity of documentation",
      },
      {
        id: 3,
        name: "Presentation",
        weight: 15,
        description: "Quality of presentation and delivery",
      },
      {
        id: 4,
        name: "Teamwork",
        weight: 15,
        description: "Collaboration and team contribution",
      },
      {
        id: 5,
        name: "Innovation",
        weight: 20,
        description: "Creativity and innovation in solution",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Evaluation Criteria
            </h1>
            <p className="text-gray-600">
              Manage evaluation criteria and rubrics
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            New Criteria Set
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Criteria Sets */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Criteria Sets
              </h3>
              <div className="space-y-4">
                {criteriaSets.map((set) => (
                  <div
                    key={set.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm"
                  >
                    <div className="font-medium text-gray-900 mb-2">
                      {set.name}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{set.criteria} criteria</span>
                      <span>Used {set.used} times</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Criteria Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentSet.name}
                </h3>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Edit Criteria
                </button>
              </div>

              <div className="space-y-4">
                {currentSet.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {criterion.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {criterion.description}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {criterion.weight}%
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-4">Weight: {criterion.weight}%</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${criterion.weight}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        Total Weight
                      </div>
                      <div className="text-gray-600">
                        Sum of all criteria weights
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
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
};

export default EvaluationCriteria;
