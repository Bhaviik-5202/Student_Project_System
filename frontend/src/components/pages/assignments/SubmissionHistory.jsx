import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";

import submissionService from "../../../services/submissionService";

const SubmissionHistory = memo(() => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await submissionService.getHistory();
        if (res) {
          const rawData = res.data || res;
          const formattedData = rawData.map((submission) => ({
            id: submission.id || submission._id,
            assignment:
              submission.assignmentId?.title ||
              submission.assignment ||
              "Unknown Assignment",
            course:
              submission.courseId?.title || submission.course || "N/A",
            submittedDate: submission.createdAt
              ? new Date(submission.createdAt).toLocaleDateString()
              : "-",
            grade: submission.grade || "Pending",
            status: submission.status || "Under Review",
            files: Array.isArray(submission.files)
              ? submission.files.length
              : 0,
          }));

          setSubmissions(formattedData);
        } else {
          setError(res?.message || "Failed to load submissions");
        }
      } catch (err) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Submission History
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View your assignment submissions and grades
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
            Download All
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                Loading submissions...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : submissions.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                No submissions found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Files
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {submissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {submission.assignment}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {submission.course}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {submission.submittedDate}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            submission.grade === "A" ||
                            submission.grade === "A-"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : submission.grade === "B+" ||
                                submission.grade === "B"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                : submission.grade === "Pending"
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {submission.grade}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            submission.status === "Graded"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : submission.status === "Under Review"
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {submission.files} file(s)
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                          View
                        </button>
                        <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SubmissionHistory.displayName = "SubmissionHistory";

export default SubmissionHistory;
