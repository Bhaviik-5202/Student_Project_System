import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, X, UserCheck, ShieldCheck, ArrowLeft, Plus } from 'lucide-react';
import projectService from '../../../services/projectService';
import api from '../../../utils/api';

const PROJECT_TYPES = [
  'Web Application',
  'Mobile Application',
  'Desktop Application',
  'AI / Machine Learning',
  'Data Science',
  'IoT & Embedded Systems',
  'Cyber Security',
  'Cloud Computing',
  'Blockchain',
  'Full Stack',
  'API Development',
  'Research Project',
];

const CLASSIFICATIONS = [
  'Major Project',
  'Minor Project',
  'Academic Project',
  'Research Project',
  'Industry Project',
  'Individual',
  'Group',
  'Final Year Project',
  'Internship Project',
  'UDP',
  'IDP',
  'Internal',
  'External',
];

const ProjectProposal = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Web Application',
    classification: 'Major Project',
    members: [],
    guide: '',
    abstract: '',
    objectives: '',
    outcomes: '',
    startDate: '',
    endDate: '',
    resources: '',
    budget: '',
    progress: 0,
    document: null,
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, facultyRes] = await Promise.allSettled([
          api.get('/users?role=student&status=active'),
          api.get('/users?role=faculty&status=active'),
        ]);

        if (studentsRes.status === 'fulfilled') {
          const raw = studentsRes.value?.data || studentsRes.value || [];
          setAvailableStudents(Array.isArray(raw) ? raw : raw.users || []);
        }

        if (facultyRes.status === 'fulfilled') {
          const raw = facultyRes.value?.data || facultyRes.value || [];
          setAvailableFaculty(Array.isArray(raw) ? raw : raw.users || []);
        }

        if (isEditing) {
          const res = await projectService.getProjectById(id);
          if (res.success && res.data) {
            const data = res.data;
            setFormData({
              title: data.title || '',
              type: data.type || 'Web Application',
              classification: data.classification || 'Major Project',
              members: Array.isArray(data.members)
                ? data.members.map((m) => (typeof m === 'object' ? m._id || m.id : m))
                : [],
              guide: typeof data.guide === 'object' ? data.guide?._id || data.guide?.id || '' : data.guide || '',
              abstract: data.abstract || '',
              objectives: data.objectives || '',
              outcomes: data.outcomes || '',
              startDate: data.startDate ? data.startDate.split('T')[0] : '',
              endDate: data.endDate ? data.endDate.split('T')[0] : '',
              resources: data.resources || '',
              budget: data.budget || '',
              progress: data.progress || 0,
              document: null,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
  }, []);

  // Filtered active students for multi-select
  const filteredStudents = useMemo(() => {
    const query = studentSearch.toLowerCase().trim();
    return availableStudents.filter(
      (s) =>
        !formData.members.includes(s._id || s.id) &&
        (s.name?.toLowerCase().includes(query) || s.email?.toLowerCase().includes(query))
    );
  }, [availableStudents, formData.members, studentSearch]);

  const addStudentMember = (studentId) => {
    if (formData.members.length >= 6) {
      toast.error('Maximum team size is 6 students.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, studentId],
    }));
    // Auto-clear search so user can immediately look for another student
    setStudentSearch('');
  };

  const removeStudentMember = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((id) => id !== studentId),
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.title.trim()) {
        toast.error('Project Title is required');
        return;
      }
      if (formData.startDate && formData.startDate < today) {
        toast.error('Start date cannot be in the past');
        return;
      }
      if (formData.endDate && formData.endDate < today) {
        toast.error('Completion date cannot be in the past');
        return;
      }

      setSubmitting(true);
      try {
        const payload = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === 'members') {
            formData.members.forEach((mId) => payload.append('members', mId));
          } else if (key === 'document') {
            if (formData.document) payload.append('document', formData.document);
          } else if (formData[key] !== null && formData[key] !== undefined) {
            payload.append(key, formData[key]);
          }
        });

        let res;
        if (isEditing) {
          res = await projectService.updateProject(id, payload);
        } else {
          res = await projectService.createProject(payload);
        }

        if (res.success) {
          toast.success(
            isEditing
              ? 'Project updated successfully!'
              : 'Project proposal created successfully!'
          );
          navigate('/projects');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setSubmitting(false);
      }
    },
    [formData, isEditing, id, navigate]
  );

  if (loading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
      </div>
    );
  }

  return (
    <div className='min-h-screen space-y-6 p-4 md:p-6 text-gray-700 dark:text-gray-300'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5 dark:border-slate-800'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => navigate('/projects')}
            className='rounded-xl border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-all hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800'
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className='text-2xl font-extrabold text-gray-900 dark:text-white'>
              {isEditing ? 'Edit Project Proposal' : 'Create Project Proposal'}
            </h1>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Formalize academic ventures with dynamic team and faculty assignment
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/projects')}
          className='rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-300'
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Main Details */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Core Info */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
              1. Project Core Details
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300'>
                  Project Title *
                </label>
                <input
                  type='text'
                  name='title'
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='e.g., AI-Driven Autonomous Health Monitoring System'
                  className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300'>
                    Project Type *
                  </label>
                  <select
                    name='type'
                    value={formData.type}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300'>
                    Classification *
                  </label>
                  <select
                    name='classification'
                    value={formData.classification}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                  >
                    {CLASSIFICATIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Student Assignment */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
                2. Student Team Assignment
              </h3>
              <span className='rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
                {formData.members.length} / 6 Assigned
              </span>
            </div>

            {/* Selected Students Pills */}
            <div className='mb-4 flex flex-wrap gap-2'>
              {formData.members.length === 0 ? (
                <div className='w-full rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center text-xs text-gray-400 dark:border-slate-800 dark:bg-slate-800/40'>
                  No students assigned yet. Search and add active students below.
                </div>
              ) : (
                formData.members.map((memId) => {
                  const student = availableStudents.find((s) => (s._id || s.id) === memId);
                  return (
                    <div
                      key={memId}
                      className='flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 py-1.5 pl-3 pr-2 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    >
                      <UserCheck size={14} />
                      <span>{student ? student.name : 'Active Student'}</span>
                      <button
                        type='button'
                        onClick={() => removeStudentMember(memId)}
                        className='rounded-lg p-0.5 hover:bg-blue-200/60 dark:hover:bg-blue-800'
                      >
                        <X size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Student Search & Add */}
            <div className='space-y-2'>
              <div className='relative'>
                <Search size={16} className='absolute left-3 top-3 text-gray-400' />
                <input
                  type='text'
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder='Search active students by name or email...'
                  className='w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-4 text-xs font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>

              {studentSearch.trim() && (
                <div className='max-h-40 overflow-y-auto rounded-xl border border-gray-100 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-800'>
                  {filteredStudents.length === 0 ? (
                    <div className='p-2 text-center text-xs text-gray-400'>
                      No active students found matching search.
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student._id || student.id}
                        onClick={() => addStudentMember(student._id || student.id)}
                        className='flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs transition-colors hover:bg-blue-50 dark:hover:bg-slate-700/50'
                      >
                        <div>
                          <p className='font-bold text-gray-900 dark:text-white'>{student.name}</p>
                          <p className='text-[10px] text-gray-400'>{student.email}</p>
                        </div>
                        <Plus size={14} className='text-blue-600 dark:text-blue-400' />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Abstract & Objectives */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
              3. Conceptual Abstract & Scope
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300'>
                  Executive Abstract
                </label>
                <textarea
                  name='abstract'
                  rows={4}
                  value={formData.abstract}
                  onChange={handleChange}
                  placeholder='Detailed technical summary and goal of the proposed project...'
                  className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300'>
                  Strategic Objectives
                </label>
                <textarea
                  name='objectives'
                  rows={3}
                  value={formData.objectives}
                  onChange={handleChange}
                  placeholder='Key milestones and technical deliverables...'
                  className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className='space-y-6'>
          {/* Faculty Assignment */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
              Project Guide (Faculty)
            </h3>
            <select
              name='guide'
              value={formData.guide}
              onChange={handleChange}
              className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
            >
              <option value=''>Awaiting Guide Assignment</option>
              {availableFaculty.map((faculty) => (
                <option key={faculty._id || faculty.id} value={faculty._id || faculty.id}>
                  {faculty.name} ({faculty.department || 'Faculty'})
                </option>
              ))}
            </select>
          </div>

          {/* Timeline & Progress */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
              Timeline Schedule
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300'>
                  Start Date
                </label>
                <input
                  type='date'
                  name='startDate'
                  min={today}
                  value={formData.startDate}
                  onChange={handleChange}
                  className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>

              <div>
                <label className='mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300'>
                  Estimated Completion Date
                </label>
                <input
                  type='date'
                  name='endDate'
                  min={formData.startDate || today}
                  value={formData.endDate}
                  onChange={handleChange}
                  className='w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>

              <div>
                <div className='mb-1 flex items-center justify-between text-xs font-bold'>
                  <span>Execution Progress</span>
                  <span className='text-blue-600 dark:text-blue-400'>{formData.progress}%</span>
                </div>
                <input
                  type='range'
                  name='progress'
                  min='0'
                  max='100'
                  step='5'
                  value={formData.progress}
                  onChange={handleChange}
                  className='w-full accent-blue-600'
                />
              </div>
            </div>
          </div>

          {/* Submission Button */}
          <button
            type='submit'
            disabled={submitting}
            className='w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50'
          >
            {submitting
              ? 'Saving Proposal...'
              : isEditing
              ? 'Update Proposal'
              : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
});

ProjectProposal.displayName = 'ProjectProposal';

export default ProjectProposal;
