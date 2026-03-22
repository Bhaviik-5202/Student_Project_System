import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import submissionService from '../../../services/submissionService';
import '../../../assets/styles/assignments.css';

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

        const responseData = res.success ? res.data : res.data || res;

        if (Array.isArray(responseData)) {
          const formattedData = responseData.map((submission) => ({
            id: submission.id || submission._id,
            assignmentId:
              submission.assignment?.id || submission.assignment?._id,
            assignment: submission.assignment?.title || 'Untitled Task',
            course:
              submission.assignment?.course?.title ||
              submission.assignment?.course?.name ||
              'N/A',
            submittedDate: submission.createdAt
              ? new Date(submission.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A',
            grade: submission.grade || 'Pending',
            status: submission.status || 'Under Review',
            filesCount: Array.isArray(submission.files)
              ? submission.files.length
              : submission.fileUrl
                ? 1
                : 0,
          }));
          setSubmissions(formattedData);
        } else {
          setError(res?.message || 'No submission history available.');
        }
      } catch (err) {
        console.error('History fetch failed', err);
        setError('Unable to retrieve submission history at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionHistory();
  }, []);

  if (loading) {
    return (
      <div className='assignment-page flex flex-col items-center justify-center'>
        <p className='assignment-subtitle italic'>
          Accessing submission archives...
        </p>
      </div>
    );
  }

  return (
    <div className='assignment-page'>
      <div className='assignment-container'>
        <div className='assignment-header'>
          <div>
            <h1 className='assignment-title'>Submission History</h1>
            <p className='assignment-subtitle'>
              Review your past academic performance and feedback
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className='assignment-btn assignment-btn-secondary'
          >
            Back
          </button>
        </div>

        <div className='assignment-table-container'>
          {error ? (
            <div className='p-12 text-center font-bold text-red-500'>
              {error}
            </div>
          ) : submissions.length === 0 ? (
            <div className='flex flex-col items-center gap-4 p-20 text-center'>
              <p className='font-medium text-gray-500'>
                You haven't submitted any assignments yet.
              </p>
              <button
                onClick={() => navigate('/assignments')}
                className='assignment-btn assignment-btn-primary'
              >
                Go to Assignments
              </button>
            </div>
          ) : (
            <table className='assignment-table'>
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Course</th>
                  <th>Submitted</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Files</th>
                  <th className='text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className='font-bold text-gray-900 dark:text-white'>
                        {item.assignment}
                      </div>
                    </td>
                    <td>
                      <div className='font-medium text-gray-600 dark:text-gray-400'>
                        {item.course}
                      </div>
                    </td>
                    <td>
                      <div className='text-gray-600 dark:text-gray-400'>
                        {item.submittedDate}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`assignment-badge ${
                          item.grade !== 'Pending'
                            ? 'badge-submitted'
                            : 'badge-pending'
                        }`}
                      >
                        {item.grade}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`assignment-badge ${
                          item.status === 'Graded'
                            ? 'badge-submitted'
                            : 'badge-progress'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className='font-bold text-gray-600 dark:text-gray-400'>
                        {item.filesCount}
                      </div>
                    </td>
                    <td className='text-right'>
                      <button
                        onClick={() =>
                          navigate(
                            `/assignments/details/${item.assignmentId || item.id}`
                          )
                        }
                        className='assignment-btn-text'
                      >
                        View
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
  );
});

SubmissionHistory.displayName = 'SubmissionHistory';
export default SubmissionHistory;
