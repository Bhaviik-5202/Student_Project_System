import { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assignmentService from "../../../services/assignmentService";

const AssignmentDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await assignmentService.getById(id);
        if (res.success) {
          setAssignment(res.data);
        } else {
          setError(res.message || "Failed to load assignment details");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading assignment details...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!assignment) return <div className="p-6 text-center">Assignment not found</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Assignment Details
        </h1>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
          ID: {assignment.id || assignment._id}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Assignment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-3">
              Basic Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Title
                </label>
                <p className="font-medium text-slate-900 dark:text-white">
                  {assignment.title}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Course
                </label>
                <p className="font-medium text-slate-900 dark:text-white">
                  {assignment.courseId?.title || assignment.course || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Due Date
                </label>
                <p className="font-medium text-rose-600 dark:text-rose-400">
                  {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : (assignment.dueDate || "N/A")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-3">
              Submission Status
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Status
                </label>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  assignment.status === 'Submitted' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                }`}>
                  {assignment.status || "Pending"}
                </span>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Points
                </label>
                <p className="font-medium text-slate-900 dark:text-white">
                  {assignment.maxScore || assignment.points || 100}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium text-slate-800 dark:text-white mb-4">
            Assignment Description
          </h3>
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300">
              {assignment.description || "No description provided."}
            </p>
          </div>
        </div>

        {assignment.instructions && (
          <div className="mt-8">
            <h3 className="font-medium text-slate-800 dark:text-white mb-4">
              Instructions
            </h3>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300">
                {assignment.instructions}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => navigate(`/assignments/submit/${assignment.id || assignment._id}`)}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Submit Assignment
          </button>
          <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
            Download Resources
          </button>
        </div>
      </div>
    </div>
  );
});

AssignmentDetails.displayName = "AssignmentDetails";

export default AssignmentDetails;
