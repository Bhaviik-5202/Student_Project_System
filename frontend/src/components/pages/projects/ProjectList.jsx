/**
 * ProjectList Component
 * Professional Project Catalog with Grid & Table views, comprehensive search & filtering,
 * pagination, active/archived tabs, and quick action modals.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FolderKanban,
  Plus,
  LayoutGrid,
  List as ListIcon,
  RotateCcw,
  UserCheck,
  Award,
  TrendingUp,
  Archive,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import useProjects from '../../../hooks/useProjects';
import { useAuth } from '../../../hooks/useAuth';
import projectService from '../../../services/projectService';
import {
  PageHeader,
  Card,
  SearchInput,
  Select,
  StatusBadge,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  LoadingState,
  EmptyState,
  ConfirmationModal,
} from './ui';

// Import Modals
import AssignStudentsModal from './modals/AssignStudentsModal';
import AssignGuideModal from './modals/AssignGuideModal';
import UpdateProgressModal from './modals/UpdateProgressModal';

const ProjectList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student';
  const canManageProjects = isAdmin;
  const canAssignGuide = isAdmin;

  const {
    projects,
    pagination,
    loading,
    filters,
    setFilter,
    resetFilters,
    refetch,
  } = useProjects();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'students' | 'guide' | 'progress' | null
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: '',
    project: null,
  });

  const [allAccessibleProjects, setAllAccessibleProjects] = useState([]);

  useEffect(() => {
    let isMounted = true;
    projectService
      .getAllProjects({ limit: 200 })
      .then((res) => {
        if (isMounted && res?.projects) {
          setAllAccessibleProjects(res.projects);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const dynamicDepartments = useMemo(() => {
    const set = new Set();
    allAccessibleProjects.forEach((p) => {
      if (p.department) set.add(p.department);
    });
    if (set.size === 0 && isAdmin) {
      return [
        'Computer Science',
        'Information Technology',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical',
        'AI & DS',
      ];
    }
    return Array.from(set).sort();
  }, [allAccessibleProjects, isAdmin]);

  const dynamicStatuses = useMemo(() => {
    const set = new Set();
    allAccessibleProjects.forEach((p) => {
      if (p.status) set.add(p.status);
    });
    if (set.size === 0) {
      return [
        'assigned',
        'in_progress',
        'under_review',
        'completed',
        'approved',
        'rejected',
      ];
    }
    return Array.from(set).sort();
  }, [allAccessibleProjects]);

  const dynamicProjectTypes = useMemo(() => {
    const set = new Set();
    allAccessibleProjects.forEach((p) => {
      if (p.projectType) set.add(p.projectType);
    });
    if (set.size === 0) {
      return [
        'Major Project',
        'Minor Project',
        'Research Project',
        'UDP',
        'IDP',
        'Industry Project',
      ];
    }
    return Array.from(set).sort();
  }, [allAccessibleProjects]);

  // Lock department filter to student's own department on mount
  useEffect(() => {
    if (isStudent && user?.department && filters.department === 'All') {
      setFilter('department', user.department);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStudent, user?.department]);

  const handleArchive = (project) => {
    setConfirmDialog({
      isOpen: true,
      type: 'archive',
      project,
      title: 'Archive Project',
      message: `Are you sure you want to archive '${project.title}'?`,
      isDanger: false,
    });
  };

  const handleRestore = async (project) => {
    try {
      const toastId = toast.loading('Restoring project...');
      await projectService.restoreProject(project._id || project.id);
      toast.success('Project restored from archives', { id: toastId });
      refetch();
    } catch (error) {
      toast.error('Failed to restore project');
    }
  };

  const handleDelete = (project) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      project,
      title: 'Delete Project',
      message: `Permanently delete '${project.title}'? This action cannot be undone.`,
      isDanger: true,
    });
  };

  const executeConfirmAction = async () => {
    const { type, project } = confirmDialog;
    if (!project) return;

    try {
      if (type === 'archive') {
        const toastId = toast.loading('Archiving project...');
        await projectService.archiveProject(project._id || project.id);
        toast.success('Project archived successfully', { id: toastId });
      } else if (type === 'delete') {
        const toastId = toast.loading('Deleting project...');
        await projectService.deleteProject(project._id || project.id);
        toast.success('Project deleted', { id: toastId });
      }
      refetch();
    } catch (error) {
      toast.error(`Failed to ${type} project`);
    } finally {
      setConfirmDialog({ isOpen: false, type: '', project: null });
    }
  };

  return (
    <div className='space-y-6 pt-0 pb-6 animate-fade-in'>
      {/* Top Bar Header */}
      <PageHeader
        title='Project Management Catalog'
        subtitle={`Showing ${projects.length} of ${pagination.total || 0} registered projects`}
        icon={FolderKanban}
        actions={
          <>
            {/* Active / Archived Tab Toggle – hidden for Students */}
            {!isStudent && (
              <div className='flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 dark:bg-slate-800'>
                <button
                  onClick={() => setFilter('isArchived', false)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    !filters.isArchived
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow dark:bg-slate-700 dark:text-indigo-400 dark:text-indigo-300'
                      : 'text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 '
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('isArchived', true)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    filters.isArchived
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow dark:bg-slate-700 dark:text-indigo-400 dark:text-indigo-300'
                      : 'text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 '
                  }`}
                >
                  Archived
                </button>
              </div>
            )}

            {/* Grid vs Table View Mode */}
            <div className='hidden md:flex rounded-xl border border-gray-200 bg-white dark:bg-slate-900 p-1 dark:border-slate-700 dark:bg-slate-800'>
              <IconButton
                icon={LayoutGrid}
                onClick={() => setViewMode('grid')}
                title='Grid View'
                variant={viewMode === 'grid' ? 'indigo' : 'default'}
              />
              <IconButton
                icon={ListIcon}
                onClick={() => setViewMode('table')}
                title='Table View'
                variant={viewMode === 'table' ? 'indigo' : 'default'}
              />
            </div>

            {canManageProjects && (
              <PrimaryButton
                icon={Plus}
                onClick={() => navigate('/projects/new')}
              >
                New Project
              </PrimaryButton>
            )}
          </>
        }
      />

      {/* Filter and Search Bar Card */}
      <Card className='space-y-4 !p-4'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-6'>
          {/* Search */}
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder='Search by title, code, techs...'
            className='md:col-span-2'
          />

          {/* Department Filter – locked for Students */}
          {isStudent ? (
            <div className='flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300'>
              <span className='font-medium'>
                {user?.department || 'My Department'}
              </span>
            </div>
          ) : (
            <Select
              value={filters.department}
              onChange={(e) => setFilter('department', e.target.value)}
            >
              <option value='All'>All Departments</option>
              {dynamicDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          )}

          {/* Status Filter */}
          <Select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
          >
            <option value='All'>All Statuses</option>
            {dynamicStatuses.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </Select>

          {/* Type Filter */}
          <Select
            value={filters.projectType}
            onChange={(e) => setFilter('projectType', e.target.value)}
          >
            <option value='All'>All Project Types</option>
            {dynamicProjectTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </Select>

          {/* Reset Filters */}
          <SecondaryButton icon={RotateCcw} onClick={resetFilters}>
            Reset
          </SecondaryButton>
        </div>
      </Card>

      {/* Projects List Content */}
      {loading ? (
        <LoadingState message='Loading project catalog...' />
      ) : projects.length === 0 ? (
        <EmptyState
          title='No Projects Found'
          description='No projects match the specified search query or filter criteria.'
          icon={FolderKanban}
          {...(!isStudent && {
            actionText: 'Create New Project',
            onAction: () => navigate('/projects/new'),
          })}
        />
      ) : (
        <>
        {/* GRID VIEW */}
        <div className={`${viewMode === 'table' ? 'hidden md:grid' : 'grid'} grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}>
          {projects.map((project) => (
            <Card
              key={project._id || project.id}
              className='flex flex-col justify-between !p-5'
            >
              <div>
                {/* Header Badge */}
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='flex items-center gap-1.5'>
                    <Badge variant='indigo'>{project.code || 'PRJ-2026'}</Badge>
                    <span className='text-[10px] font-bold text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500'>
                      {project.department}
                    </span>
                  </div>
                  <StatusBadge status={project.status || 'assigned'} />
                </div>

                {/* Title */}
                <h3
                  onClick={() =>
                    navigate(
                      `/projects/${project.slug || project._id || project.id}`
                    )
                  }
                  className='text-base font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-indigo-400  cursor-pointer line-clamp-2 transition-colors'
                >
                  {project.title}
                </h3>

                {/* Description abstract */}
                <p className='mt-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500'>
                  {project.description || 'No detailed abstract specified.'}
                </p>

                {/* Guide & Team info */}
                <div className='mt-4 space-y-2 border-t border-gray-100 pt-3 dark:border-slate-700/60'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-gray-400 dark:text-gray-500 font-medium'>
                      Guide:
                    </span>
                    <span className='font-bold text-gray-800 dark:text-gray-200'>
                      {project.guide
                        ? typeof project.guide === 'object'
                          ? project.guide.name
                          : 'Assigned'
                        : 'Unassigned'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-gray-400 dark:text-gray-500 font-medium'>
                      Team:
                    </span>
                    <span className='font-semibold text-gray-700 dark:text-gray-300'>
                      {Array.isArray(project.members)
                        ? `${project.members.length} Students`
                        : '0 Members'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className='mt-3 space-y-1'>
                  <div className='flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500'>
                    <span>PROGRESS</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-900'>
                    <div
                      className='h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 rounded-full'
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-slate-700'>
                <div className='flex gap-1'>
                  {canManageProjects && (
                    <IconButton
                      icon={UserCheck}
                      variant='indigo'
                      title='Assign Students'
                      onClick={() => {
                        setSelectedProjectForModal(project);
                        setActiveModal('students');
                      }}
                    />
                  )}
                  {canAssignGuide && (
                    <IconButton
                      icon={Award}
                      variant='purple'
                      title='Assign Guide'
                      onClick={() => {
                        setSelectedProjectForModal(project);
                        setActiveModal('guide');
                      }}
                    />
                  )}
                  {/* Update Progress – Admin/Faculty only */}
                  {!isStudent && (
                    <IconButton
                      icon={TrendingUp}
                      variant='blue'
                      title='Update Progress'
                      onClick={() => {
                        setSelectedProjectForModal(project);
                        setActiveModal('progress');
                      }}
                    />
                  )}
                  {canManageProjects &&
                    (filters.isArchived ? (
                      <IconButton
                        icon={RotateCcw}
                        variant='emerald'
                        title='Restore Project'
                        onClick={() => handleRestore(project)}
                      />
                    ) : (
                      <IconButton
                        icon={Archive}
                        variant='amber'
                        title='Archive Project'
                        onClick={() => handleArchive(project)}
                      />
                    ))}
                  {canManageProjects && (
                    <IconButton
                      icon={Trash2}
                      variant='danger'
                      title='Delete Project'
                      onClick={() => handleDelete(project)}
                    />
                  )}
                </div>

                <SecondaryButton
                  size='sm'
                  icon={ExternalLink}
                  onClick={() =>
                    navigate(
                      `/projects/${project.slug || project._id || project.id}`
                    )
                  }
                >
                  Details
                </SecondaryButton>
              </div>
            </Card>
          ))}
        </div>

        {/* TABLE VIEW */}
        <div className={`${viewMode === 'grid' ? 'hidden' : 'hidden md:block'}`}>
          <Table>
          <TableHeader>
            <tr>
              <TableHead>Code</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Guide</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align='right'>Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id || project.id}>
                <TableCell className='font-extrabold text-indigo-600 dark:text-indigo-400 dark:text-indigo-300'>
                  {project.code || 'PRJ'}
                </TableCell>
                <TableCell className='font-bold text-gray-900 dark:text-white max-w-xs truncate'>
                  <span
                    onClick={() =>
                      navigate(
                        `/projects/${project.slug || project._id || project.id}`
                      )
                    }
                    className='cursor-pointer hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-indigo-400 transition-colors'
                  >
                    {project.title}
                  </span>
                </TableCell>
                <TableCell className='text-gray-600 dark:text-gray-300'>
                  {project.department}
                </TableCell>
                <TableCell className='text-gray-700 dark:text-gray-300 font-semibold'>
                  {project.guide
                    ? typeof project.guide === 'object'
                      ? project.guide.name
                      : 'Assigned'
                    : 'Unassigned'}
                </TableCell>
                <TableCell className='w-32'>
                  <div className='flex items-center gap-2'>
                    <div className='h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-900'>
                      <div
                        className='h-full bg-indigo-600 dark:bg-indigo-500 rounded-full'
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className='font-bold text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500'>
                      {project.progress || 0}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={project.status || 'assigned'} />
                </TableCell>
                <TableCell align='right'>
                  <div className='flex justify-end gap-1'>
                    <IconButton
                      icon={ExternalLink}
                      variant='indigo'
                      title='View Details'
                      onClick={() =>
                        navigate(
                          `/projects/${project.slug || project._id || project.id}`
                        )
                      }
                    />
                    {canManageProjects && (
                      <IconButton
                        icon={Edit}
                        variant='indigo'
                        title='Edit Project'
                        onClick={() =>
                          navigate(
                            `/projects/${project._id || project.id}/edit`
                          )
                        }
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
        </>
      )}

      {/* Pagination Controls */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setFilter('page', p)}
      />

      {/* Action Modals */}
      <AssignStudentsModal
        isOpen={activeModal === 'students'}
        onClose={() => setActiveModal(null)}
        project={selectedProjectForModal}
        onSuccess={refetch}
      />
      <AssignGuideModal
        isOpen={activeModal === 'guide'}
        onClose={() => setActiveModal(null)}
        project={selectedProjectForModal}
        onSuccess={refetch}
      />
      <UpdateProgressModal
        isOpen={activeModal === 'progress'}
        onClose={() => setActiveModal(null)}
        project={selectedProjectForModal}
        onSuccess={refetch}
      />

      {/* Confirmation Modal for Delete/Archive */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ isOpen: false, type: '', project: null })
        }
        onConfirm={executeConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDanger={confirmDialog.isDanger}
        confirmText={confirmDialog.type === 'delete' ? 'Delete' : 'Archive'}
      />
    </div>
  );
};

export default ProjectList;
