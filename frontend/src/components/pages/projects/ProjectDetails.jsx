/**
 * ProjectDetails Component
 * Comprehensive Project Details screen featuring sub-tabs: Overview, Team & Guide,
 * Progress & Status, Files & Docs, Reviews & Evaluation, and Audit Activity Log.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ChevronLeft,
  Edit,
  UserCheck,
  Award,
  TrendingUp,
  FilePlus,
  Star,
  Github,
  Globe,
  FileText,
  Trash2,
  ExternalLink,
  History,
  FolderKanban,
} from 'lucide-react';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';
import {
  Card,
  Badge,
  StatusBadge,
  SecondaryButton,
  PrimaryButton,
  IconButton,
  LoadingState,
  SectionHeader,
  ConfirmationModal,
} from './ui';

// Modals
import AssignStudentsModal from './modals/AssignStudentsModal';
import AssignGuideModal from './modals/AssignGuideModal';
import UpdateProgressModal from './modals/UpdateProgressModal';
import AddFileModal from './modals/AddFileModal';
import AddReviewModal from './modals/AddReviewModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'team' | 'progress' | 'files' | 'reviews' | 'timeline'

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'students' | 'guide' | 'progress' | 'file' | 'review' | null
  const [fileToRemove, setFileToRemove] = useState(null);

  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjectById(id);
      setProject(data);
    } catch (err) {
      console.error('Failed to load project details', err);
      toast.error('Could not load project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const confirmRemoveFile = async () => {
    if (!fileToRemove) return;
    try {
      const toastId = toast.loading('Removing file...');
      await projectService.removeProjectFile(
        project._id || project.id,
        fileToRemove._id
      );
      toast.success('File removed', { id: toastId });
      fetchProjectDetails();
    } catch (err) {
      toast.error('Failed to remove file');
    } finally {
      setFileToRemove(null);
    }
  };

  if (loading) {
    return <LoadingState message='Loading project details...' />;
  }

  if (!project) return null;

  const guideObj = typeof project.guide === 'object' ? project.guide : null;
  const leaderObj = typeof project.leader === 'object' ? project.leader : null;
  const membersList = Array.isArray(project.members) ? project.members : [];

  return (
    <div className='space-y-6 pt-0 pb-6 animate-fade-in'>
      {/* Top Navigation */}
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigate('/projects')}
          className='flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-indigo-400 transition-colors'
        >
          <ChevronLeft size={16} /> Back to Catalog
        </button>

        <SecondaryButton
          icon={Edit}
          onClick={() =>
            navigate(`/projects/${project._id || project.id}/edit`)
          }
        >
          Edit Project
        </SecondaryButton>
      </div>

      {/* Hero Header Card */}
      <Card className='space-y-4 !p-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Badge variant='indigo'>{project.code}</Badge>
              <Badge variant='gray'>{project.department}</Badge>
              <Badge variant='purple'>{project.projectType}</Badge>
            </div>
            <h1 className='text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
              {project.title}
            </h1>
          </div>

          <div className='flex items-center gap-4 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shrink-0'>
            <div className='text-right'>
              <div className='text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                Progress
              </div>
              <div className='text-xl font-extrabold text-indigo-600 dark:text-indigo-400 dark:text-indigo-300'>
                {project.progress || 0}%
              </div>
            </div>
            <div className='h-8 w-px bg-gray-200 dark:bg-slate-700' />
            <div>
              <div className='text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5'>
                Status
              </div>
              <StatusBadge status={project.status || 'assigned'} />
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className='flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto pt-2'>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'team', label: `Team & Guide (${membersList.length})` },
            { id: 'progress', label: 'Progress & Status' },
            {
              id: 'files',
              label: `Files & Docs (${project.files?.length || 0})`,
            },
            {
              id: 'reviews',
              label: `Reviews (${project.reviews?.length || 0})`,
            },
            { id: 'timeline', label: 'Activity Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-5 py-3 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 dark:text-indigo-400 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 '
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Tab Content Panes */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            {/* Description */}
            <Card className='space-y-3'>
              <SectionHeader title='Project Abstract & Summary' />
              <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line'>
                {project.description || 'No detailed abstract provided.'}
              </p>
            </Card>

            {/* Objectives & Outcomes */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card className='space-y-2'>
                <h4 className='text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                  Core Objectives
                </h4>
                <p className='text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>
                  {project.objectives || 'Not specified'}
                </p>
              </Card>

              <Card className='space-y-2'>
                <h4 className='text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                  Expected Outcomes
                </h4>
                <p className='text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>
                  {project.outcomes || 'Not specified'}
                </p>
              </Card>
            </div>

            {/* Technologies */}
            <Card className='space-y-3'>
              <SectionHeader title='Technology Stack' />
              <div className='flex flex-wrap gap-2 mt-2'>
                {Array.isArray(project.technologies) &&
                project.technologies.length > 0 ? (
                  project.technologies.map((tech, i) => (
                    <Badge
                      key={i}
                      variant='indigo'
                      className='!px-3 !py-1 !text-xs'
                    >
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <p className='text-xs text-gray-400 dark:text-gray-500 italic'>
                    No technologies defined
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Info Sidebar */}
          <div className='space-y-6'>
            <Card className='space-y-4'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                Project Metadata
              </h3>

              <div className='space-y-3 text-xs'>
                <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-700'>
                  <span className='text-gray-400 dark:text-gray-500'>
                    Category:
                  </span>
                  <span className='font-bold text-gray-800 dark:text-gray-200'>
                    {project.category}
                  </span>
                </div>
                <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-700'>
                  <span className='text-gray-400 dark:text-gray-500'>
                    Semester:
                  </span>
                  <span className='font-bold text-gray-800 dark:text-gray-200'>
                    {project.semester}
                  </span>
                </div>
                <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-700'>
                  <span className='text-gray-400 dark:text-gray-500'>
                    Academic Year:
                  </span>
                  <span className='font-bold text-gray-800 dark:text-gray-200'>
                    {project.academicYear}
                  </span>
                </div>
                <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-700'>
                  <span className='text-gray-400 dark:text-gray-500'>
                    Start Date:
                  </span>
                  <span className='font-bold text-gray-800 dark:text-gray-200'>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between py-1.5'>
                  <span className='text-gray-400 dark:text-gray-500'>
                    Expected Completion:
                  </span>
                  <span className='font-bold text-gray-800 dark:text-gray-200'>
                    {project.expectedCompletionDate
                      ? new Date(
                          project.expectedCompletionDate
                        ).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </Card>

            {/* External Links */}
            <Card className='space-y-3'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                Resource Links
              </h3>
              <div className='space-y-2'>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-2.5 rounded-xl border border-gray-200 p-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-slate-700  transition-colors'
                  >
                    <Github size={16} /> GitHub Repository
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-2.5 rounded-xl border border-gray-200 p-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-slate-700  transition-colors'
                  >
                    <Globe size={16} /> Live Application Demo
                  </a>
                )}
                {!project.githubUrl && !project.demoUrl && (
                  <p className='text-xs text-gray-400 dark:text-gray-500 italic'>
                    No external links attached
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TEAM & GUIDE TAB */}
      {activeTab === 'team' && (
        <div className='space-y-6'>
          {/* Guide Card */}
          <Card>
            <SectionHeader
              title='Faculty Mentor / Guide'
              icon={Award}
              action={
                <SecondaryButton
                  size='sm'
                  onClick={() => setActiveModal('guide')}
                >
                  Change Guide
                </SecondaryButton>
              }
            />

            {guideObj ? (
              <div className='flex items-center gap-4 p-4 rounded-xl border border-purple-100 bg-purple-50/40 dark:border-purple-900/40 dark:bg-purple-900/10 mt-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 dark:bg-purple-500 text-base font-extrabold text-white shrink-0'>
                  {guideObj.name ? guideObj.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                  <h4 className='text-base font-bold text-gray-900 dark:text-white'>
                    {guideObj.name}
                  </h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500'>
                    {guideObj.designation || 'Faculty Member'} •{' '}
                    {guideObj.department || project.department} •{' '}
                    {guideObj.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className='py-6 text-center text-xs text-gray-400 dark:text-gray-500 italic'>
                No faculty guide currently allocated to this project.
              </p>
            )}
          </Card>

          {/* Student Team Members */}
          <Card>
            <SectionHeader
              title='Assigned Team Members'
              icon={UserCheck}
              action={
                <PrimaryButton
                  size='sm'
                  onClick={() => setActiveModal('students')}
                >
                  Manage Team Members
                </PrimaryButton>
              }
            />

            {membersList.length === 0 ? (
              <p className='py-8 text-center text-xs text-gray-400 dark:text-gray-500 italic'>
                No student members currently assigned.
              </p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                {membersList.map((member, idx) => {
                  const isObj = typeof member === 'object';
                  const name = isObj ? member.name : 'Student Member';
                  const email = isObj ? member.email : '';
                  const studentId = isObj ? member.studentId : '';
                  const isLeader =
                    leaderObj &&
                    (leaderObj._id || leaderObj.id) ===
                      (isObj ? member._id || member.id : member);

                  return (
                    <div
                      key={idx}
                      className='flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-slate-700 dark:bg-slate-900/50'
                    >
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 shrink-0'>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <h4 className='text-xs font-bold text-gray-900 dark:text-white truncate'>
                            {name}
                          </h4>
                          {isLeader && (
                            <Badge variant='indigo' className='!px-1.5 !py-0.2'>
                              Leader
                            </Badge>
                          )}
                        </div>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 truncate mt-0.5'>
                          {studentId ? `ID: ${studentId} • ` : ''}
                          {email}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* PROGRESS TAB */}
      {activeTab === 'progress' && (
        <Card className='space-y-6'>
          <SectionHeader
            title='Progress & Status Management'
            icon={TrendingUp}
            action={
              <PrimaryButton
                icon={TrendingUp}
                size='sm'
                onClick={() => setActiveModal('progress')}
                className='!bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800'
              >
                Update Progress
              </PrimaryButton>
            }
          />

          <div className='p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-xs font-bold uppercase text-gray-500 dark:text-gray-400 dark:text-gray-500'>
                Overall Completion
              </span>
              <span className='text-2xl font-extrabold text-blue-600 dark:text-blue-400'>
                {project.progress || 0}%
              </span>
            </div>
            <div className='h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800'>
              <div
                className='h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 rounded-full'
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* FILES TAB */}
      {activeTab === 'files' && (
        <Card className='space-y-6'>
          <SectionHeader
            title='Project Documents & Resources'
            icon={FilePlus}
            action={
              <PrimaryButton
                icon={FilePlus}
                size='sm'
                onClick={() => setActiveModal('file')}
                className='!bg-gradient-to-r !from-emerald-600 !to-emerald-700 hover:!from-emerald-700 hover:!to-emerald-800'
              >
                Attach File
              </PrimaryButton>
            }
          />

          {!project.files || project.files.length === 0 ? (
            <p className='py-12 text-center text-xs text-gray-400 dark:text-gray-500 italic'>
              No documents or links attached to this project yet.
            </p>
          ) : (
            <div className='divide-y divide-gray-100 dark:divide-slate-700'>
              {project.files.map((file) => (
                <div
                  key={file._id}
                  className='flex items-center justify-between py-3.5'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0'>
                      <FileText size={20} />
                    </div>
                    <div>
                      <a
                        href={file.url}
                        target='_blank'
                        rel='noreferrer'
                        className='text-xs font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400  flex items-center gap-1 transition-colors'
                      >
                        {file.name} <ExternalLink size={12} />
                      </a>
                      <p className='text-[10px] text-gray-400 dark:text-gray-500 mt-0.5'>
                        {file.fileType} • Uploaded{' '}
                        {file.uploadedAt
                          ? new Date(file.uploadedAt).toLocaleDateString()
                          : 'recently'}
                      </p>
                    </div>
                  </div>

                  <IconButton
                    icon={Trash2}
                    variant='danger'
                    title='Remove Document'
                    onClick={() => setFileToRemove(file)}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <Card className='space-y-6'>
          <SectionHeader
            title='Faculty Evaluation & Reviews'
            icon={Star}
            action={
              <PrimaryButton
                icon={Star}
                size='sm'
                onClick={() => setActiveModal('review')}
                className='!bg-gradient-to-r !from-amber-600 !to-amber-700 hover:!from-amber-700 hover:!to-amber-800'
              >
                Add Review
              </PrimaryButton>
            }
          />

          {!project.reviews || project.reviews.length === 0 ? (
            <p className='py-12 text-center text-xs text-gray-400 dark:text-gray-500 italic'>
              No faculty reviews recorded yet.
            </p>
          ) : (
            <div className='space-y-4'>
              {project.reviews.map((rev) => (
                <div
                  key={rev._id}
                  className='rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800/50 p-4 dark:border-slate-700 dark:bg-slate-900/50 space-y-2'
                >
                  <div className='flex items-center justify-between'>
                    <Badge variant='amber'>
                      {rev.milestone || 'Evaluation'}
                    </Badge>
                    <div className='flex items-center text-amber-400 dark:text-amber-500'>
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} fill='currentColor' />
                      ))}
                    </div>
                  </div>

                  <p className='text-xs text-gray-700 dark:text-gray-300 leading-relaxed'>
                    {rev.comment}
                  </p>

                  <div className='text-[10px] text-gray-400 dark:text-gray-500 pt-1'>
                    Reviewed on{' '}
                    {rev.date ? new Date(rev.date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <Card className='space-y-6'>
          <SectionHeader title='Audit Trail & History' icon={History} />

          {!project.activityTimeline ||
          project.activityTimeline.length === 0 ? (
            <p className='py-8 text-center text-xs text-gray-400 dark:text-gray-500 italic'>
              No activity logs recorded.
            </p>
          ) : (
            <div className='space-y-4 relative pl-4 border-l-2 border-gray-100 dark:border-slate-700 mt-4'>
              {project.activityTimeline.map((item, idx) => (
                <div key={idx} className='relative pl-4 space-y-0.5'>
                  <div className='absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-indigo-600 dark:bg-indigo-500 ring-4 ring-white dark:ring-slate-800' />
                  <div className='text-xs font-bold text-gray-900 dark:text-white'>
                    {item.action}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500'>
                    {item.details}
                  </div>
                  <div className='text-[10px] text-gray-400 dark:text-gray-500'>
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleString()
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Action Modals */}
      <AssignStudentsModal
        isOpen={activeModal === 'students'}
        onClose={() => setActiveModal(null)}
        project={project}
        onSuccess={fetchProjectDetails}
      />
      <AssignGuideModal
        isOpen={activeModal === 'guide'}
        onClose={() => setActiveModal(null)}
        project={project}
        onSuccess={fetchProjectDetails}
      />
      <UpdateProgressModal
        isOpen={activeModal === 'progress'}
        onClose={() => setActiveModal(null)}
        project={project}
        onSuccess={fetchProjectDetails}
      />
      <AddFileModal
        isOpen={activeModal === 'file'}
        onClose={() => setActiveModal(null)}
        project={project}
        onSuccess={fetchProjectDetails}
      />
      <AddReviewModal
        isOpen={activeModal === 'review'}
        onClose={() => setActiveModal(null)}
        project={project}
        onSuccess={fetchProjectDetails}
      />

      <ConfirmationModal
        isOpen={Boolean(fileToRemove)}
        onClose={() => setFileToRemove(null)}
        onConfirm={confirmRemoveFile}
        title='Remove File'
        message={`Are you sure you want to remove '${fileToRemove?.name}' from the project?`}
        isDanger
        confirmText='Remove'
      />
    </div>
  );
};

export default ProjectDetails;
