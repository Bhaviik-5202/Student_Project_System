import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import assignmentService from "../../../services/assignmentService";
import { useAuth } from "../../../hooks/useAuth";
import { ROLE_COMBINATIONS } from "../../../config/roles";

/**
 * AssignmentList Component
 * 
 * A centralized hub for academic task management. Provides a 
 * comprehensive tabular view of all assignments with real-time status 
 * tracking, point allocations, and role-based action workflows for 
 * both students and faculty.
 */
const AssignmentList = memo(() => {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await assignmentService.getAll();
        // Assuming assignmentService.getAll returns the standardized response
        if (response.success) {
          setAssignments(response.data || []);
        } else {
          console.error("Failed to fetch assignments:", response.message);
        }
      } catch (error) {
        console.error("Failed to fetch assignments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);

  return (
    <div className="assignment-page">
      <div className="assignment-container">
        <div className="assignment-header">
          <div>
            <h1 className="assignment-title">
              Assignments
            </h1>
            <p className="assignment-subtitle">
              View and manage all assignments
            </p>
          </div>
          {hasAnyRole(ROLE_COMBINATIONS.ADMIN_FACULTY) && (
            <button
              onClick={() => handleNavigate("/assignments/upload")}
              className="assignment-btn assignment-btn-primary"
            >
              New Assignment
            </button>
          )}
        </div>

        <div className="assignment-table-container">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--assignment-text-muted)" }}>Loading assignments...</td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--assignment-text-muted)" }}>No assignments found.</td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id || assignment._id}>
                    <td>
                      <div style={{ fontWeight: "600", color: "var(--assignment-text-main)" }}>
                        {assignment.title}
                      </div>
                    </td>
                    <td>
                      {assignment.course?.title || assignment.course?.name || "N/A"}
                    </td>
                    <td>
                      {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`assignment-badge ${
                          assignment.status === "Submitted"
                            ? "badge-submitted"
                            : assignment.status === "In Progress"
                              ? "badge-progress"
                              : "badge-pending"
                        }`}
                      >
                        {assignment.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      {assignment.points || assignment.maxScore || 100}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleNavigate(`/assignments/${assignment.id || assignment._id}`)
                        }
                        className="assignment-btn-text"
                        style={{ marginRight: "12px" }}
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleNavigate(`/assignments/submit/${assignment.id || assignment._id}`)
                        }
                        className="assignment-btn-text"
                        style={{ color: "var(--color-success)" }}
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

AssignmentList.displayName = "AssignmentList";

export default AssignmentList;
