/**
 * ProjectProposal Component
 * Complete form for submitting new project proposals or editing existing projects.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FolderPlus, ChevronLeft, Save, Users } from 'lucide-react';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';
import {
  PageHeader,
  Card,
  FormGroup,
  Input,
  Select,
  TextArea,
  PrimaryButton,
  SecondaryButton,
  LoadingState,
  SectionHeader,
} from './ui';

const ProjectProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  // Active student & faculty dropdown options
  const [activeStudents, setActiveStudents] = useState([]);
  const [activeFaculty, setActiveFaculty] = useState([]);
  const [optionsHierarchy, setOptionsHierarchy] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    department: user?.department || '',
    projectType: '',
    category: '',
    semester: 'Sem 7',
    academicYear: '2025-2026',
    description: '',
    objectives: '',
    outcomes: '',
    technologiesText: '',
    guide: '',
    members: [],
    startDate: '',
    expectedCompletionDate: '',
    progress: 0,
    status: 'assigned',
    githubUrl: '',
    demoUrl: '',
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const [students, faculty, options] = await Promise.all([
          projectService.getActiveStudents(),
          projectService.getActiveFaculty(),
          projectService.getProjectOptions(),
        ]);
        setActiveStudents(students || []);
        setActiveFaculty(faculty || []);
        setOptionsHierarchy(options || []);

        if (isEditing) {
          const project = await projectService.getProjectById(id);
          if (project) {
            setFormData({
              title: project.title || '',
              code: project.code || '',
              department: project.department || '',
              projectType: project.projectType || '',
              category: project.category || '',
              semester: project.semester || 'Sem 7',
              academicYear: project.academicYear || '2025-2026',
              description: project.description || '',
              objectives: project.objectives || '',
              outcomes: project.outcomes || '',
              technologiesText: Array.isArray(project.technologies)
                ? project.technologies.join(', ')
                : '',
              guide: project.guide
                ? typeof project.guide === 'object'
                  ? project.guide._id || project.guide.id
                  : project.guide
                : '',
              members: Array.isArray(project.members)
                ? project.members.map((m) =>
                  typeof m === 'object' ? m._id || m.id : m
                )
                : [],
              startDate: project.startDate
                ? new Date(project.startDate).toISOString().split('T')[0]
                : '',
              expectedCompletionDate: project.expectedCompletionDate
                ? new Date(project.expectedCompletionDate)
                  .toISOString()
                  .split('T')[0]
                : '',
              progress: project.progress || 0,
              status: project.status || 'assigned',
              githubUrl: project.githubUrl || '',
              demoUrl: project.demoUrl || '',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load project form data', err);
        toast.error('Error loading form data');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEditing]);

  // Derived dynamic options based on Department -> Category -> ProjectType hierarchy
  const availableDepartments = useMemo(() => {
    return optionsHierarchy.map((d) => d.name);
  }, [optionsHierarchy]);

  const availableCategories = useMemo(() => {
    if (!formData.department) return [];
    const deptObj = optionsHierarchy.find((d) => d.name === formData.department);
    return deptObj ? deptObj.categories.map((c) => c.name) : [];
  }, [optionsHierarchy, formData.department]);

  const availableProjectTypes = useMemo(() => {
    if (!formData.department || !formData.category) return [];
    const deptObj = optionsHierarchy.find((d) => d.name === formData.department);
    if (!deptObj) return [];
    const catObj = deptObj.categories.find((c) => c.name === formData.category);
    return catObj ? catObj.projectTypes : [];
  }, [optionsHierarchy, formData.department, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (e) => {
    const newDept = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department: newDept,
      category: '', // Reset Domain Category when Department changes
      projectType: '', // Reset Project Type when Department changes
    }));
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      projectType: '', // Reset Project Type when Domain Category changes
    }));
  };

  const handleMemberToggle = (studentId) => {
    setFormData((prev) => {
      const exists = prev.members.includes(studentId);
      return {
        ...prev,
        members: exists
          ? prev.members.filter((id) => id !== studentId)
          : [...prev.members, studentId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading(
        isEditing ? 'Updating project...' : 'Submitting proposal...'
      );

      const technologies = formData.technologiesText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        technologies,
        guide: formData.guide || null,
        progress: Number(formData.progress) || 0,
      };

      if (isEditing) {
        await projectService.updateProject(id, payload);
        toast.success('Project updated successfully!', { id: toastId });
      } else {
        await projectService.createProject(payload);
        toast.success('Project proposal created successfully!', {
          id: toastId,
        });
      }

      navigate('/projects');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message='Loading project form...' />;
  }

  return (
    <div className='space-y-6 pt-0 pb-6 animate-fade-in'>
      {/* Page Header */}
      <PageHeader
        title={
          isEditing ? 'Edit Project Specification' : 'Submit Project Proposal'
        }
        subtitle={
          isEditing
            ? 'Update architecture and parameters'
            : 'Define initial proposal parameters for governance review'
        }
        icon={FolderPlus}
        actions={
          <SecondaryButton
            icon={ChevronLeft}
            onClick={() => navigate('/projects')}
          >
            Back to Catalog
          </SecondaryButton>
        }
      />

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 gap-6 lg:grid-cols-3'
      >
        {/* Left Column - Core Info */}
        <div className='space-y-6 lg:col-span-2'>
          {/* General Information */}
          <Card className='space-y-4'>
            <SectionHeader title='Core Project Details' />

            <FormGroup label='Project Title' required>
              <Input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder='e.g. AI-Powered Autonomous Student Performance Tracker'
                required
              />
            </FormGroup>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormGroup label='Project Code (Optional Auto-generated)'>
                <Input
                  type='text'
                  name='code'
                  value={formData.code}
                  onChange={handleChange}
                  placeholder='e.g. PRJ-2026-001'
                  className='uppercase font-semibold'
                />
              </FormGroup>

              <FormGroup label='Department' required>
                <Select
                  name='department'
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  required
                >
                  <option value=''>-- Select Department --</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormGroup label='Domain Category' required>
                <Select
                  name='category'
                  value={formData.category}
                  onChange={handleCategoryChange}
                  disabled={!formData.department || availableCategories.length === 0}
                  required
                >
                  <option value=''>
                    {!formData.department
                      ? '-- Select Department First --'
                      : '-- Select Domain Category --'}
                  </option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup label='Project Type' required>
                <Select
                  name='projectType'
                  value={formData.projectType}
                  onChange={handleChange}
                  disabled={!formData.category || availableProjectTypes.length === 0}
                  required
                >
                  <option value=''>
                    {!formData.category
                      ? '-- Select Category First --'
                      : '-- Select Project Type --'}
                  </option>
                  {availableProjectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </div>

            <FormGroup label='Semester & Academic Year'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Select
                  name='semester'
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value='Sem 1'>Sem 1</option>
                  <option value='Sem 2'>Sem 2</option>
                  <option value='Sem 3'>Sem 3</option>
                  <option value='Sem 4'>Sem 4</option>
                  <option value='Sem 5'>Sem 5</option>
                  <option value='Sem 6'>Sem 6</option>
                  <option value='Sem 7'>Sem 7</option>
                  <option value='Sem 8'>Sem 8</option>
                </Select>
                <Select
                  name='academicYear'
                  value={formData.academicYear}
                  onChange={handleChange}
                >
                  <option value='2025-2026'>2025-2026</option>
                  <option value='2026-2027'>2026-2027</option>
                  <option value='2027-2028'>2027-2028</option>
                  <option value='2028-2029'>2028-2029</option>
                  <option value='2029-2030'>2029-2030</option>
                  <option value='2030-2031'>2030-2031</option>
                </Select>
              </div>
            </FormGroup>

            {/* Scope / Description */}
            <FormGroup label='Abstract / Detailed Description'>
              <TextArea
                name='description'
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder='Describe the problem statement, background, scope, and implementation strategy...'
              />
            </FormGroup>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormGroup label='Objectives'>
                <TextArea
                  name='objectives'
                  value={formData.objectives}
                  onChange={handleChange}
                  rows={3}
                  placeholder='Key objectives...'
                />
              </FormGroup>

              <FormGroup label='Expected Outcomes'>
                <TextArea
                  name='outcomes'
                  value={formData.outcomes}
                  onChange={handleChange}
                  rows={3}
                  placeholder='Deliverables & results...'
                />
              </FormGroup>
            </div>

            <FormGroup label='Technologies (Comma-separated)'>
              <Input
                type='text'
                name='technologiesText'
                value={formData.technologiesText}
                onChange={handleChange}
                placeholder='e.g. React, Node.js, Express, MongoDB, Tailwind, Python'
              />
            </FormGroup>
          </Card>

          {/* Student Team Selection */}
          <Card className='space-y-4'>
            <SectionHeader
              title={`Student Team Members (${formData.members.length} Selected)`}
              icon={Users}
            />

            <div className='max-h-48 overflow-y-auto space-y-2 pr-1'>
              {activeStudents.map((s) => {
                const sId = s._id || s.id;
                const isSelected = formData.members.includes(sId);
                return (
                  <div
                    key={sId}
                    onClick={() => handleMemberToggle(sId)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-900/20'
                      : 'border-gray-100 hover:border-gray-200 dark:border-slate-700'
                      }`}
                  >
                    <span className='text-xs font-bold text-gray-900 dark:text-white'>
                      {s.name} ({s.department || 'Student'})
                    </span>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      readOnly
                      className='accent-indigo-600 h-4 w-4 rounded'
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column - Configurations */}
        <div className='space-y-6'>
          <Card className='space-y-4'>
            <SectionHeader title='Faculty & Submission' />

            <FormGroup label='Faculty Guide'>
              <Select
                name='guide'
                value={formData.guide}
                onChange={handleChange}
              >
                <option value=''>-- Select Faculty Guide --</option>
                {activeFaculty.map((f) => (
                  <option key={f._id || f.id} value={f._id || f.id}>
                    {f.name} ({f.department || 'Faculty'})
                  </option>
                ))}
              </Select>
            </FormGroup>

            <PrimaryButton
              type='submit'
              disabled={submitting}
              icon={Save}
              className='w-full !py-3.5 mt-2'
            >
              {submitting
                ? 'Saving...'
                : isEditing
                  ? 'Update Project'
                  : 'Submit Project Proposal'}
            </PrimaryButton>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default ProjectProposal;
