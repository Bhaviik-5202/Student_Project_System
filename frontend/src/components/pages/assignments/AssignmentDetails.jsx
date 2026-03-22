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
    <div className="p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignment Details</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">{assignment.course?.title || assignment.course?.name || "Academic Module"}</p>
        </div>
        <button
          onClick={() => navigate("/assignments")}
          className="btn btn-secondary"
        >
          Back to Registry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card shadow-lg border-gray-100 dark:border-slate-800">
            <div className="card-body p-6 md:p-10">
              <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{assignment.title}</h2>
                <div className={`px-4 py-1.5 text-[11px] font-bold rounded-full shadow-sm ${
                  assignment.status === "Submitted" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {assignment.status || "Pending"}
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                    {assignment.description || "No description provided for this assignment."}
                  </div>
                </div>

                {assignment.instructions && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Targeted Instructions</h3>
                    <div className="p-6 bg-indigo-50/40 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/20 rounded-2xl text-indigo-900 dark:text-indigo-300 text-sm font-medium italic leading-relaxed shadow-sm">
                      {assignment.instructions}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/assignments/submit/${id}`)}
              className="btn btn-primary flex-1 h-14 text-base font-bold"
            >
              Submit Assignment
            </button>
            <button 
              onClick={() => navigate("/assignments/history")}
              className="btn btn-secondary flex-1 h-14 text-base font-bold"
            >
              View Submission History
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="card shadow-sm border-gray-100 dark:border-slate-800 p-8">
            <div className="space-y-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Metadata</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-5 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Due Date</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="p-5 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Max Score</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{assignment.points || assignment.maxScore || 100} Pts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Card */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="card shadow-sm border-gray-100 dark:border-slate-800 p-8">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resources</h3>
                <div className="space-y-3">
                  {assignment.attachments.map((filePath, index) => {
                    const fileName = filePath.split(/[/\\]/).pop();
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 group hover:border-indigo-300 transition-all cursor-pointer shadow-sm">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{fileName}</span>
                        </div>
                        <button className="text-[10px] font-black tracking-tighter text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-lg">Get</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AssignmentDetails.displayName = "AssignmentDetails";

export default AssignmentDetails;
