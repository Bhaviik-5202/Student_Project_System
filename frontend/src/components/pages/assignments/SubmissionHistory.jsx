import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import submissionService from "../../../services/submissionService";

/**
 * SubmissionHistory Component
 * 
 * Provides students with a comprehensive log of their academic 
 * output. Displays submission dates, status indicators, and 
 * recorded grades across different courses and tasks.
 */
const SubmissionHistory = memo(() => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await submissionService.getHistory();
        
        // Handle both direct data and wrapped success/data format
        const responseData = res.success ? res.data : (res.data || res);
        
        if (Array.isArray(responseData)) {
          const formattedData = responseData.map((submission) => ({
            id: submission.id || submission._id,
            assignmentId: submission.assignment?.id || submission.assignment?._id,
            assignment: submission.assignment?.title || "Untitled Task",
            course: submission.assignment?.course?.title || submission.assignment?.course?.name || "N/A",
            submittedDate: submission.createdAt
              ? new Date(submission.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A",
            grade: submission.grade || "Pending",
            status: submission.status || "Under Review",
            filesCount: Array.isArray(submission.files) ? submission.files.length : (submission.fileUrl ? 1 : 0),
          }));
          setSubmissions(formattedData);
        } else {
          setError(res?.message || "No submission history available.");
        }
      } catch (err) {
        console.error("History fetch failed", err);
        setError("Unable to retrieve submission history at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionHistory();
  }, []);

  if (loading) {
    return (
      <div className="assignment-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p className="assignment-subtitle">Accessing submission archives...</p>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      <div className="assignment-container">
        <div className="assignment-header">
          <div>
            <h1 className="assignment-title">Submission History</h1>
            <p className="assignment-subtitle">Review your past academic performance and feedback</p>
          </div>
          <button onClick={() => navigate(-1)} className="assignment-btn assignment-btn-outline">
            Back
          </button>
        </div>

        <div className="assignment-card" style={{ padding: 0, overflow: "hidden" }}>
          {error ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--color-error)" }}>{error}</p>
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p className="assignment-subtitle">You haven't submitted any assignments yet.</p>
              <button 
                onClick={() => navigate("/assignments")} 
                className="assignment-btn assignment-btn-primary" 
                style={{ marginTop: "16px" }}
              >
                Go to Assignments
              </button>
            </div>
          ) : (
            <div className="assignment-table-container">
              <table className="assignment-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Course</th>
                    <th>Submitted</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Files</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: "600" }}>{item.assignment}</div>
                      </td>
                      <td>{item.course}</td>
                      <td>{item.submittedDate}</td>
                      <td>
                        <span className={`assignment-badge ${
                          item.grade !== "Pending" ? "badge-submitted" : "badge-pending"
                        }`}>
                          {item.grade}
                        </span>
                      </td>
                      <td>
                        <span className={`assignment-badge ${
                          item.status === "Graded" ? "badge-submitted" : "badge-pending"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.filesCount}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            className="assignment-btn-text" 
                            style={{ color: "var(--assignment-primary)" }}
                            onClick={() => navigate(`/assignments/details/${item.assignmentId || item.id}`)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SubmissionHistory.displayName = "SubmissionHistory";

export default SubmissionHistory;
