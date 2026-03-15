import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const GradingRubric = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rubric, setRubric] = useState({
    name: "Project Evaluation Rubric",
    criteria: [],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchRubric = async () => {
      try {
        const response = await api.get(`/assignments/rubric/${id || ''}`);
        if (response.data) {
          setRubric(response.data);
        } else {
          // Provide fallback if empty
          setRubric({
            name: "Project Evaluation Rubric",
            criteria: [
              {
                id: 1,
                criterion: "Technical Implementation",
                maxPoints: 30,
                description: "Quality of code and technical execution",
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to fetch rubric", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchRubric();
  }, []);

  const updateCriterion = useCallback((id, field, value) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.map((criterion) =>
        criterion.id === id ? { ...criterion, [field]: value } : criterion,
      ),
    }));
  }, []);

  const addCriterion = useCallback(() => {
    setRubric((prev) => {
      const newId = Math.max(...prev.criteria.map((c) => c.id)) + 1;
      return {
        ...prev,
        criteria: [
          ...prev.criteria,
          {
            id: newId,
            criterion: "New Criterion",
            maxPoints: 10,
            description: "Criterion description",
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
      toast.success("Rubric saved successfully");
      setLoading(false);
    }, 1000);
  }, []);

  const totalPoints = useMemo(
    () =>
      rubric.criteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0),
    [rubric.criteria],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Grading Rubric
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Create and manage grading rubrics
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveRubric}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Rubric"}
              </button>
              <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Rubric Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              value={rubric.name}
              onChange={(e) => setRubric({ ...rubric, name: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Rubric Criteria
              </h3>
              <button
                onClick={addCriterion}
                className="px-3 py-1 bg-emerald-600 dark:bg-emerald-700 text-white text-sm rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-800"
              >
                Add Criterion
              </button>
            </div>

            {initialLoading ? (
              <div className="text-center py-4 text-slate-500">Loading rubric...</div>
            ) : (
              <div className="space-y-4">
              {rubric.criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 mb-2"
                        value={criterion.criterion}
                        onChange={(e) =>
                          updateCriterion(
                            criterion.id,
                            "criterion",
                            e.target.value,
                          )
                        }
                      />
                      <textarea
                        rows="2"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-sm"
                        value={criterion.description}
                        onChange={(e) =>
                          updateCriterion(
                            criterion.id,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Criterion description"
                      />
                    </div>
                    <div className="ml-4 flex items-start">
                      <div className="mr-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Max Points
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                          value={criterion.maxPoints}
                          onChange={(e) =>
                            updateCriterion(
                              criterion.id,
                              "maxPoints",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeCriterion(criterion.id)}
                        className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 mt-7"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  Total Points
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Sum of all criteria points
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalPoints}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GradingRubric.displayName = "GradingRubric";

export default GradingRubric;
