import { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assignmentService from "../../../services/assignmentService";
import "../../../assets/styles/assignments.css";

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
      <div className="assignment-page flex flex-col items-center justify-center">
        <p className="assignment-subtitle italic animate-pulse">Loading assignment details...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="assignment-page">
        <div className="assignment-container" style={{ maxWidth: '600px' }}>
          <div className="assignment-card text-center" style={{ borderColor: 'var(--color-error)' }}>
            <h2 className="text-red-500 font-bold mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">{error || "Assignment not found"}</p>
            <button 
              onClick={() => navigate("/assignments")}
              className="assignment-btn assignment-btn-outline mt-6"
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
          <div>
            <h1 className="assignment-title">Assignment Details</h1>
            <p className="assignment-subtitle">{assignment.course?.title || assignment.course?.name || "Academic Module"}</p>
          </div>
          <button
            onClick={() => navigate("/assignments")}
            className="assignment-btn assignment-btn-secondary"
          >
            Back to Registry
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="assignment-card">
              <div className="assignment-card-header flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{assignment.title}</h2>
                <div className={`assignment-badge ${
                  assignment.status === "Submitted" 
                    ? "badge-submitted" 
                    : "badge-pending"
                }`}>
                  {assignment.status || "Pending"}
                </div>
              </div>

              <div className="space-y-8">
                <div className="assignment-detail-section">
                  <h3 className="assignment-detail-title">Description</h3>
                  <div className="assignment-detail-content">
                    {assignment.description || "No description provided for this assignment."}
                  </div>
                </div>

                {assignment.instructions && (
                  <div className="assignment-detail-section">
                    <h3 className="assignment-detail-title">Targeted Instructions</h3>
                    <div className="assignment-detail-content bg-indigo-50/40 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-800/20 italic">
                      {assignment.instructions}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/assignments/submit/${id}`)}
                className="assignment-btn assignment-btn-primary flex-1 h-12"
              >
                Submit Assignment
              </button>
              <button 
                onClick={() => navigate("/assignments/history")}
                className="assignment-btn assignment-btn-secondary flex-1 h-12"
              >
                View Submission History
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Metadata Card */}
            <div className="assignment-card">
              <h3 className="assignment-detail-title mb-6">Metadata</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Due Date</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Max Score</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {assignment.points || assignment.maxScore || 100} Pts
                  </p>
                </div>
              </div>
            </div>

            {/* Resources Card */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="assignment-card">
                <h3 className="assignment-detail-title mb-6">Resources</h3>
                <div className="space-y-3">
                  {assignment.attachments.map((filePath, index) => {
                    const fileName = filePath.split(/[/\\]/).pop();
                    return (
                      <div key={index} className="assignment-file-item group hover:border-indigo-300 transition-all border border-transparent">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{fileName}</span>
                        </div>
                        <button className="assignment-btn-text text-[10px] uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">Get</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

AssignmentDetails.displayName = "AssignmentDetails";
export default AssignmentDetails;
