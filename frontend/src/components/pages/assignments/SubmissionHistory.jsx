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
    <div className="p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submission History</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Review your past academic performance and feedback</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary"
        >
          Back
        </button>
      </div>

      <div className="card shadow-sm overflow-hidden">
        {error ? (
          <div className="p-12 text-center">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <p className="text-gray-500 font-medium">You haven't submitted any assignments yet.</p>
            <button 
              onClick={() => navigate("/assignments")} 
              className="btn btn-primary"
            >
              Go to Assignments
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Assignment</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Course</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Submitted</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Grade</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Files</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group text-sm">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{item.assignment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-medium">{item.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{item.submittedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.grade !== "Pending" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.status === "Graded" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-bold">{item.filesCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => navigate(`/assignments/details/${item.assignmentId || item.id}`)}
                        className="text-indigo-600 dark:text-indigo-400 font-bold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

SubmissionHistory.displayName = "SubmissionHistory";

export default SubmissionHistory;
