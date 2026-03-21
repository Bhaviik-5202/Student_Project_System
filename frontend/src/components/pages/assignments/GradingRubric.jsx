import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

/**
 * GradingRubric Component
 * 
 * An administrative interface for educators to define evaluation 
 * criteria for assignments. Supports dynamic addition/removal of 
 * criteria, point assignment, and total score calculation.
 */
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
    const fetchRubricData = async () => {
      try {
        setInitialLoading(true);
        const response = await api.get(`/assignments/rubric/${id || ""}`);
        if (response.data && response.data.success) {
          setRubric(response.data.data);
        } else {
          // Provide default structure if none exists
          setRubric({
            name: "New Evaluation Rubric",
            criteria: [
              {
                id: Date.now(),
                criterion: "Technical Implementation",
                maxPoints: 30,
                description: "Quality of code and technical execution",
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to fetch rubric", error);
        toast.error("Failed to fetch rubric data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchRubricData();
  }, [id]);

  const updateCriterion = useCallback((criterionId, field, value) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.map((criterion) =>
        criterion.id === criterionId ? { ...criterion, [field]: value } : criterion,
      ),
    }));
  }, []);

  const addCriterion = useCallback(() => {
    setRubric((prev) => {
      const newId = prev.criteria.length > 0 ? Math.max(...prev.criteria.map((c) => c.id)) + 1 : Date.now();
      return {
        ...prev,
        criteria: [
          ...prev.criteria,
          {
            id: newId,
            criterion: "New Criterion",
            maxPoints: 10,
            description: "Describe what is being evaluated",
          },
        ],
      };
    });
  }, []);

  const removeCriterion = useCallback((criterionId) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((criterion) => criterion.id !== criterionId),
    }));
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/assignments/rubric/${id || ""}`, rubric);
      if (response.data && response.data.success) {
        toast.success("Rubric saved successfully");
      } else {
        toast.error(response.data?.message || "Failed to save rubric");
      }
    } catch (error) {
      console.error("Save failed", error);
      toast.error("An error occurred while saving the rubric");
    } finally {
      setLoading(false);
    }
  };

  const totalPointsTotal = useMemo(
    () => rubric.criteria.reduce((sum, criterion) => sum + (Number(criterion.maxPoints) || 0), 0),
    [rubric.criteria],
  );

  if (initialLoading) {
    return (
      <div className="assignment-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p className="assignment-subtitle">Loading rubric data...</p>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      <div className="assignment-container">
        <div className="assignment-header" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              <h1 className="assignment-title">Grading Rubric</h1>
              <p className="assignment-subtitle">Define assessment criteria and point weights</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => navigate(-1)} className="assignment-btn assignment-btn-outline">
                Back
              </button>
              <button 
                onClick={handleSave} 
                disabled={loading} 
                className="assignment-btn assignment-btn-primary"
              >
                {loading ? "Saving..." : "Save Rubric"}
              </button>
            </div>
          </div>
        </div>

        <div className="assignment-card">
          <div className="assignment-form-group">
            <label className="assignment-label">Rubric Name</label>
            <input
              type="text"
              className="assignment-input"
              value={rubric.name}
              onChange={(e) => setRubric({ ...rubric, name: e.target.value })}
              placeholder="e.g. Project Final Evaluation"
            />
          </div>

          <div style={{ margin: "32px 0 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="assignment-detail-title" style={{ margin: 0 }}>Evaluation Criteria</h3>
            <button onClick={addCriterion} className="assignment-btn-text" style={{ color: "var(--color-success)" }}>
              + Add New Criterion
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {rubric.criteria.length === 0 ? (
              <div className="assignment-card" style={{ textAlign: "center", padding: "32px", borderStyle: "dashed" }}>
                <p className="assignment-subtitle">No criteria added yet. Add one to start building your rubric.</p>
              </div>
            ) : (
              rubric.criteria.map((criterion) => (
                <div key={criterion.id} className="assignment-card" style={{ padding: "16px", backgroundColor: "var(--assignment-bg-light)" }}>
                  <div className="assignment-grid assignment-grid-2" style={{ alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        className="assignment-input"
                        style={{ marginBottom: "8px", fontWeight: "600" }}
                        value={criterion.criterion}
                        onChange={(e) => updateCriterion(criterion.id, "criterion", e.target.value)}
                        placeholder="Criterion Title"
                      />
                      <textarea
                        className="assignment-textarea"
                        style={{ fontSize: "14px" }}
                        rows="2"
                        value={criterion.description}
                        onChange={(e) => updateCriterion(criterion.id, "description", e.target.value)}
                        placeholder="Description of what constitutes full points..."
                      />
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", width: "fit-content" }}>
                      <div className="assignment-form-group" style={{ margin: 0 }}>
                        <label className="assignment-label" style={{ fontSize: "12px" }}>Max Points</label>
                        <input
                          type="number"
                          className="assignment-input"
                          style={{ width: "80px" }}
                          value={criterion.maxPoints}
                          onChange={(e) => updateCriterion(criterion.id, "maxPoints", e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeCriterion(criterion.id)}
                        className="assignment-btn-text"
                        style={{ color: "var(--color-error)", paddingBottom: "10px" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="assignment-card" style={{ marginTop: "32px", border: "1px solid var(--assignment-primary)", backgroundColor: "var(--assignment-bg-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: "700", color: "var(--assignment-primary)" }}>Total Rubric Score</p>
                <p className="assignment-subtitle" style={{ fontSize: "12px" }}>Calculated sum of all criteria point values</p>
              </div>
              <p style={{ fontSize: "32px", fontWeight: "800", color: "var(--assignment-primary)" }}>
                {totalPointsTotal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GradingRubric.displayName = "GradingRubric";

export default GradingRubric;
