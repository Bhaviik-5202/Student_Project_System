import { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assignmentService from "../../../services/assignmentService";

/**
 * AssignmentDetails Component
 * 
 * Provides an in-depth view of a specific academic assignment.
 * Displays title, course information, deadline, points, and 
 * detailed description, with clear call-to-action buttons for 
 * submission and resource downloads.
 */
const AssignmentDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        setLoading(true);
        const response = await assignmentService.getById(id);
        if (response.success) {
          setAssignment(response.data);
        } else {
          setError(response.message || "Assignment not found");
        }
      } catch (err) {
        setError("Failed to fetch assignment details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssignmentDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="assignment-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p className="assignment-subtitle">Loading assignment details...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="assignment-page">
        <div className="assignment-container">
          <div className="assignment-card" style={{ textAlign: "center", borderColor: "var(--color-error)" }}>
            <h2 style={{ color: "var(--color-error)" }}>Error</h2>
            <p>{error || "Assignment not found"}</p>
            <button 
              onClick={() => navigate("/assignments")}
              className="assignment-btn assignment-btn-outline"
              style={{ marginTop: "16px" }}
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      <div className="assignment-container">
        <div className="assignment-header">
          <button
            onClick={() => navigate("/assignments")}
            className="assignment-btn-text"
            style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "4px" }}
          >
            ← Back to List
          </button>
        </div>

        <div className="assignment-card">
          <div className="assignment-card-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 className="assignment-title">{assignment.title}</h1>
                <p className="assignment-subtitle">
                  {assignment.course?.title || assignment.course?.name || "Course Not Specified"}
                </p>
              </div>
              <span className={`assignment-badge ${
                assignment.status === "Submitted" ? "badge-submitted" : "badge-pending"
              }`}>
                {assignment.status || "Pending"}
              </span>
            </div>
          </div>

          <div className="assignment-grid assignment-grid-2" style={{ marginBottom: "24px" }}>
            <div className="assignment-card" style={{ padding: "16px", backgroundColor: "var(--assignment-bg-light)" }}>
              <p className="assignment-subtitle" style={{ fontSize: "12px", textTransform: "uppercase" }}>Due Date</p>
              <p style={{ fontWeight: "600" }}>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}</p>
            </div>
            <div className="assignment-card" style={{ padding: "16px", backgroundColor: "var(--assignment-bg-light)" }}>
              <p className="assignment-subtitle" style={{ fontSize: "12px", textTransform: "uppercase" }}>Points Total</p>
              <p style={{ fontWeight: "600" }}>{assignment.points || assignment.maxScore || 100} Points</p>
            </div>
          </div>

          <div className="assignment-detail-section">
            <h3 className="assignment-detail-title">Description</h3>
            <div className="assignment-detail-content">
              {assignment.description || "No description provided for this assignment."}
            </div>
          </div>

          {assignment.instructions && (
            <div className="assignment-detail-section">
              <h3 className="assignment-detail-title">Instructions</h3>
              <div className="assignment-detail-content">
                {assignment.instructions}
              </div>
            </div>
          )}

          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="assignment-detail-section">
              <h3 className="assignment-detail-title">Resources & Attachments</h3>
              <div className="assignment-file-list">
                {assignment.attachments.map((filePath, index) => {
                  const fileName = filePath.split(/[/\\]/).pop();
                  return (
                    <div key={index} className="assignment-file-item">
                      <span>{fileName}</span>
                      <button className="assignment-btn-text">Download</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: "32px", display: "flex", gap: "16px" }}>
            <button
              onClick={() => navigate(`/assignments/submit/${id}`)}
              className="assignment-btn assignment-btn-primary"
              style={{ flex: 1 }}
            >
              Submit Assignment
            </button>
            <button className="assignment-btn assignment-btn-outline" style={{ flex: 1 }}>
              View Submission History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

AssignmentDetails.displayName = "AssignmentDetails";

export default AssignmentDetails;
