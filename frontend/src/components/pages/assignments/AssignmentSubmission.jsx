import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import submissionService from '../../../services/submissionService';
import assignmentService from '../../../services/assignmentService';
import toast from 'react-hot-toast';
const AssignmentSubmission = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    comment: '',
    files: [],
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await assignmentService.getById(id);
        if (response.success) {
          setAssignment(response.data);
          setFormData((prev) => ({
            ...prev,
            title: `Submission: ${response.data.title}`,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch assignment', error);
        toast.error('Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));
  }, []);

  const removeFile = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading('Submitting assignment...');

      const submissionData = new FormData();
      submissionData.append('assignment', id);
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description);
      submissionData.append('comments', formData.comment);

      formData.files.forEach((file) => {
        submissionData.append('file', file);
      });

      const response = await submissionService.createSubmission(submissionData);

      if (response.success) {
        toast.success('Assignment submitted successfully!', { id: toastId });
        navigate('/assignments');
      } else {
        toast.error(response.message || 'Failed to submit assignment', {
          id: toastId,
        });
      }
    } catch (error) {
      console.error('Submission failed', error);
      toast.error('An error occurred during submission');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='assignment-page flex flex-col items-center justify-center'>
        <p className='assignment-subtitle italic'>
          Loading assignment details...
        </p>
      </div>
    );
  }

  return (
    <div className='assignment-page'>
      <div className='assignment-container' style={{ maxWidth: '800px' }}>
        <div className='assignment-header'>
          <div>
            <h1 className='assignment-title'>Submit Assignment</h1>
            <p className='assignment-subtitle'>
              {assignment?.title} -{' '}
              {assignment?.course?.title ||
                assignment?.courseId?.title ||
                'Course Name'}
            </p>
          </div>
        </div>

        <div className='assignment-card'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='assignment-form-group'>
              <label className='assignment-label'>Submission Title</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                className='assignment-input'
                placeholder='Enter submission title'
                required
              />
            </div>

            <div className='assignment-form-group'>
              <label className='assignment-label'>Description (Optional)</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                className='assignment-textarea'
                placeholder='Briefly describe your work'
                rows='3'
              />
            </div>

            <div className='assignment-form-group'>
              <label className='assignment-label'>Upload Files</label>
              <div
                className='assignment-upload-area'
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div>
                  <p className='mb-1 text-sm font-bold text-indigo-600'>
                    Click to upload
                  </p>
                  <p className='text-xs font-black uppercase tracking-tight text-gray-400'>
                    PDF, ZIP, DOCX up to 10MB
                  </p>
                </div>
                <input
                  id='fileInput'
                  type='file'
                  multiple
                  onChange={handleFileChange}
                  className='hidden'
                />
              </div>

              {formData.files.length > 0 && (
                <div className='assignment-file-list'>
                  {formData.files.map((file, index) => (
                    <div key={index} className='assignment-file-item'>
                      <span className='truncate text-sm font-bold text-gray-700 dark:text-gray-300'>
                        {file.name}
                      </span>
                      <button
                        type='button'
                        onClick={() => removeFile(index)}
                        className='assignment-btn-text text-red-500 hover:text-red-600'
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='assignment-form-group'>
              <label className='assignment-label'>
                Comments for Instructor
              </label>
              <textarea
                name='comment'
                value={formData.comment}
                onChange={handleInputChange}
                className='assignment-textarea'
                placeholder='Any additional notes...'
                rows='2'
              />
            </div>

            <div className='mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 dark:border-slate-800 sm:flex-row'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='assignment-btn assignment-btn-secondary flex-1'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='assignment-btn assignment-btn-primary flex-2'
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

AssignmentSubmission.displayName = 'AssignmentSubmission';
export default AssignmentSubmission;
