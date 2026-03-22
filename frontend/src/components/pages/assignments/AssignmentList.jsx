import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import assignmentService from '../../../services/assignmentService';
import { useAuth } from '../../../hooks/useAuth';
import { ROLE_COMBINATIONS } from '../../../config/roles';
import '../../../assets/styles/assignments.css';

const AssignmentList = memo(() => {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await assignmentService.getAll();
        if (response.success) {
          setAssignments(response.data || []);
        } else {
          console.error('Failed to fetch assignments:', response.message);
        }
      } catch (error) {
        console.error('Failed to fetch assignments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);

  return (
    <div className='assignment-page'>
      <div className='assignment-container'>
        <div className='assignment-header'>
          <div>
            <h1 className='assignment-title'>Assignments</h1>
            <p className='assignment-subtitle'>
              View and manage academic tasks and submissions
            </p>
          </div>
          {hasAnyRole(ROLE_COMBINATIONS.ADMIN_FACULTY) && (
            <button
              onClick={() => handleNavigate('/assignments/upload')}
              className='assignment-btn assignment-btn-primary'
            >
              New Assignment
            </button>
          )}
        </div>

        <div className='assignment-table-container'>
          <table className='assignment-table'>
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Points</th>
                <th className='text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan='6'
                    className='py-12 text-center italic text-gray-400'
                  >
                    Loading assignments...
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td
                    colSpan='6'
                    className='py-12 text-center italic text-gray-400'
                  >
                    No assignments found in the registry.
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id || assignment._id}>
                    <td>
                      <div className='font-bold text-gray-900 dark:text-white'>
                        {assignment.title}
                      </div>
                    </td>
                    <td>
                      <div className='font-medium text-gray-600 dark:text-gray-400'>
                        {assignment.course?.title ||
                          assignment.course?.name ||
                          'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className='text-gray-600 dark:text-gray-400'>
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`assignment-badge ${
                          assignment.status === 'Submitted'
                            ? 'badge-submitted'
                            : assignment.status === 'In Progress'
                              ? 'badge-progress'
                              : 'badge-pending'
                        }`}
                      >
                        {assignment.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className='font-bold text-gray-900 dark:text-white'>
                        {assignment.points || assignment.maxScore || 100}
                      </div>
                    </td>
                    <td className='space-x-3 text-right'>
                      <button
                        onClick={() =>
                          handleNavigate(
                            `/assignments/${assignment.id || assignment._id}`
                          )
                        }
                        className='assignment-btn-text'
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleNavigate(
                            `/assignments/submit/${assignment.id || assignment._id}`
                          )
                        }
                        className='assignment-btn-text'
                        style={{ color: '#10b981' }}
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

AssignmentList.displayName = 'AssignmentList';
export default AssignmentList;
