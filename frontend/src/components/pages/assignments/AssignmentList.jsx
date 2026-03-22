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
    <div className="p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            View and manage all academic tasks and submissions
          </p>
        </div>
        {hasAnyRole(ROLE_COMBINATIONS.ADMIN_FACULTY) && (
          <button
            onClick={() => handleNavigate("/assignments/upload")}
            className="btn btn-primary"
          >
            New Assignment
          </button>
        )}
      </div>

      <div className="table-responsive bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-800">
        <table className="table">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Assignment Title</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Course</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Due Date</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Status</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400">Points</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400 italic">Loading assignments...</td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400 italic">No assignments found in the registry.</td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment.id || assignment._id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group text-sm">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-medium">
                    {assignment.course?.title || assignment.course?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${assignment.status === "Submitted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : assignment.status === "In Progress"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                    >
                      {assignment.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">
                    {assignment.points || assignment.maxScore || 100}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-3 text-indigo-600 dark:text-indigo-400 font-bold">
                    <button
                      onClick={() =>
                        handleNavigate(`/assignments/${assignment.id || assignment._id}`)
                      }
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleNavigate(`/assignments/submit/${assignment.id || assignment._id}`)
                      }
                      className="text-emerald-600 dark:text-emerald-400"
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
  );
});

AssignmentList.displayName = "AssignmentList";

export default AssignmentList;
