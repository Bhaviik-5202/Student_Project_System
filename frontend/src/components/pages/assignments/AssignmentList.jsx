import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

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
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/assignments");
        setAssignments(response.data?.data || []);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Assignments
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage all assignments
            </p>
          </div>
          <button
            onClick={() => handleNavigate("/assignments/new")}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            New Assignment
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Assignment Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-slate-500">Loading assignments...</td>
                  </tr>
                ) : assignments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-slate-500">No assignments found.</td>
                  </tr>
                ) : (
                  assignments.map((assignment) => (
                    <tr
                      key={assignment.id || assignment._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {assignment.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {assignment.course || (assignment.courseId ? assignment.courseId.title : "N/A")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {assignment.dueDate || new Date(assignment.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            assignment.status === "Submitted"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : assignment.status === "In Progress"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                : assignment.status === "Pending"
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {assignment.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                        {assignment.points || assignment.maxScore || 100}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleNavigate(`/assignments/${assignment.id || assignment._id}`)
                          }
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            handleNavigate(`/assignments/${assignment.id || assignment._id}/submit`)
                          }
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300"
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
    </div>
  );
});

AssignmentList.displayName = "AssignmentList";

export default AssignmentList;
