import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

const EvaluationForm = memo(() => {
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState({
    student: '',
    project: '',
    criteria: [
      { name: 'Technical Skills', score: 0, maxScore: 20 },
      { name: 'Documentation', score: 0, maxScore: 15 },
      { name: 'Presentation', score: 0, maxScore: 15 },
      { name: 'Teamwork', score: 0, maxScore: 15 },
      { name: 'Innovation', score: 0, maxScore: 20 },
      { name: 'Timeliness', score: 0, maxScore: 15 },
    ],
    comments: '',
    overallScore: 0,
  });
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [studentsRes, projectsRes] = await Promise.all([
          api.get('/users?role=student').catch(() => ({ data: [] })),
          api.get('/projects').catch(() => ({ data: [] })),
        ]);
        setStudents(studentsRes.data || []);
        setProjects(projectsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch form data', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchFormData();
  }, []);

  const calculateTotal = useCallback(() => {
    setEvaluation((prev) => {
      const total = prev.criteria.reduce((sum, item) => sum + item.score, 0);
      return { ...prev, overallScore: total };
    });
  }, []);

  const handleScoreChange = useCallback(
    (index, value) => {
      setEvaluation((prev) => {
        const newCriteria = [...prev.criteria];
        newCriteria[index].score = Math.min(
          Math.max(0, value),
          newCriteria[index].maxScore
        );
        return { ...prev, criteria: newCriteria };
      });
      setTimeout(calculateTotal, 0);
    },
    [calculateTotal]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await api.post('/evaluations', evaluation);
        toast.success('Evaluation submitted successfully');
        navigate('/evaluations');
      } catch (error) {
        console.error('Evaluation submission failed', error);
        toast.error(
          error.response?.data?.message || 'Failed to submit evaluation'
        );
      } finally {
        setLoading(false);
      }
    },
    [evaluation, navigate]
  );

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            ← Back
          </button>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Project Evaluation
          </h1>
          <p className='text-slate-600 dark:text-slate-400'>
            Evaluate student projects and provide feedback
          </p>
        </div>

        <div className='max-w-4xl rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Basic Information */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Student Name
                </label>
                <select
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                  value={evaluation.student}
                  onChange={(e) =>
                    setEvaluation({ ...evaluation, student: e.target.value })
                  }
                  disabled={loadingData}
                >
                  <option value=''>
                    {loadingData ? 'Loading students...' : 'Select Student'}
                  </option>
                  {students.map((student) => (
                    <option
                      key={student.id || student._id}
                      value={student.id || student._id}
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Project Title
                </label>
                <select
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                  value={evaluation.project}
                  onChange={(e) =>
                    setEvaluation({ ...evaluation, project: e.target.value })
                  }
                  disabled={loadingData}
                >
                  <option value=''>
                    {loadingData ? 'Loading projects...' : 'Select Project'}
                  </option>
                  {projects.map((project) => (
                    <option
                      key={project.id || project._id}
                      value={project.id || project._id}
                    >
                      {project.title || project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Evaluation Criteria
              </h3>
              <div className='space-y-4'>
                {evaluation.criteria.map((criterion, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50'
                  >
                    <div>
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {criterion.name}
                      </div>
                      <div className='text-sm text-slate-600 dark:text-slate-400'>
                        Max: {criterion.maxScore} points
                      </div>
                    </div>
                    <div className='flex items-center gap-4'>
                      <input
                        type='number'
                        min='0'
                        max={criterion.maxScore}
                        className='w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                        value={criterion.score}
                        onChange={(e) =>
                          handleScoreChange(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                      <span className='text-slate-600 dark:text-slate-400'>
                        / {criterion.maxScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Score */}
            <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='text-lg font-semibold text-slate-900 dark:text-white'>
                    Overall Score
                  </h4>
                  <p className='text-slate-600 dark:text-slate-400'>
                    Total out of 100 points
                  </p>
                </div>
                <div className='text-right'>
                  <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                    {evaluation.overallScore}
                  </div>
                  <div className='text-slate-600 dark:text-slate-400'>
                    / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Feedback and Comments
              </label>
              <textarea
                rows='4'
                className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                value={evaluation.comments}
                onChange={(e) =>
                  setEvaluation({ ...evaluation, comments: e.target.value })
                }
                placeholder='Provide detailed feedback for the student...'
              />
            </div>

            <div className='flex gap-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600'
              >
                {loading ? 'Submitting...' : 'Submit Evaluation'}
              </button>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

EvaluationForm.displayName = 'EvaluationForm';

export default EvaluationForm;
