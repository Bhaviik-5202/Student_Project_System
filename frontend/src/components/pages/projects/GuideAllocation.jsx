import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import projectService from '../../../services/projectService';
import staffService from '../../../services/staffService';
import api from '../../../utils/api';
import { notifyDataChanged } from '../../../utils/eventBus';

const GuideCard = memo(({ guide }) => {
  const statusClass =
    guide.status === 'Available'
      ? 'text-green-600 bg-green-50'
      : 'text-amber-600 bg-amber-50';

  return (
    <div className='project-card-simple'>
      <div className='mb-4 flex items-center gap-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30'>
          <i className='fas fa-user-tie text-indigo-600'></i>
        </div>
        <div>
          <h3 className='text-sm font-bold leading-tight text-gray-900 dark:text-white'>
            {guide.guide}
          </h3>
          <p className='text-xs text-gray-500'>{guide.department}</p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 text-[11px] font-medium tracking-wider'>
        <div className='rounded-lg bg-gray-50 p-2 dark:bg-slate-900/50'>
          <p className='mb-0.5 text-gray-400'>Capacity</p>
          <p className='text-gray-900 dark:text-white'>
            {guide.allocatedGroups}/{guide.maxCapacity}
          </p>
        </div>
        <div className={`rounded-lg p-2 ${statusClass} dark:bg-opacity-10`}>
          <p className='mb-0.5 opacity-70'>Status</p>
          <p className='font-bold'>{guide.status}</p>
        </div>
      </div>
    </div>
  );
});

GuideCard.displayName = 'GuideCard';

const AllocationRow = memo(({ project, availableGuides, onAssign }) => {
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState('');

  const handleAssignClick = () => {
    if (selectedGuide) {
      onAssign(project.id, selectedGuide);
    }
  };

  return (
    <tr className='transition-colors hover:bg-gray-50 dark:hover:bg-slate-900/50'>
      <td
        className='whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-gray-400 dark:text-slate-500'
        title={project.id}
      >
        #{project.id.slice(-4).toUpperCase()}
      </td>
      <td className='whitespace-nowrap px-6 py-4'>
        <p className='text-sm font-semibold text-gray-900 dark:text-white'>
          {project.name}
        </p>
      </td>
      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
        {project.group}
      </td>
      <td className='whitespace-nowrap px-6 py-4'>
        <span
          className={`rounded-full px-2 py-1 text-sm ${project.currentGuide === 'None' ? 'bg-yellow-50 font-bold text-yellow-700' : 'text-gray-600'}`}
        >
          {project.currentGuide}
        </span>
      </td>
      <td className='flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm'>
        <select
          value={selectedGuide}
          onChange={(e) => setSelectedGuide(e.target.value)}
          className='w-full max-w-[150px] rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800'
        >
          <option value=''>Select Guide</option>
          {availableGuides.map((guide) => (
            <option key={guide.id} value={guide.id}>
              {guide.guide}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssignClick}
          className='project-btn project-btn-primary px-3 py-1.5'
        >
          Assign
        </button>
        <button
          onClick={() => navigate(`/projects/${project.slug || project.id}`)}
          className='project-btn project-btn-secondary p-1.5'
          title='View Details'
        >
          Details
        </button>
      </td>
    </tr>
  );
});

AllocationRow.displayName = 'AllocationRow';

const GuideAllocationList = memo(() => {
  const [allocations, setAllocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoadingGuides(true);
      try {
        const [staffRes, facultyRes] = await Promise.allSettled([
          staffService.getAllStaff(),
          api.get('/users?role=faculty&status=active'),
        ]);

        let guideList = [];
        if (facultyRes.status === 'fulfilled' && facultyRes.value?.data) {
          const raw = facultyRes.value.data || [];
          const users = Array.isArray(raw) ? raw : raw.users || [];
          guideList = users.map((g) => ({
            id: g._id || g.id,
            guide: g.name,
            department: g.department || 'Computer Science',
            allocatedGroups: 0,
            maxCapacity: 5,
            students: 0,
            status: 'Available',
          }));
        }

        if (guideList.length === 0 && staffRes.status === 'fulfilled' && staffRes.value?.success) {
          guideList = (staffRes.value.data || [])
            .filter((s) => s.role?.toLowerCase() === 'faculty' || s.role?.toLowerCase() === 'guide')
            .map((g) => ({
              id: g._id || g.id,
              guide: g.name,
              department: g.department || 'General',
              allocatedGroups: g.allocatedGroups || 0,
              maxCapacity: g.maxCapacity || 5,
              students: g.studentsCount || 0,
              status: (g.allocatedGroups || 0) < (g.maxCapacity || 5) ? 'Available' : 'Full',
            }));
        }

        setAllocations(guideList);
      } catch (err) {
        console.error('Failed to fetch guides', err);
      } finally {
        setLoadingGuides(false);
      }
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      const res = await projectService.getAllProjects();
      if (res.success) {
        setProjects(
          (res.data || []).map((p) => ({
            id: p._id || p.id,
            slug: p.slug,
            name: p.title,
            group:
              Array.isArray(p.members) && p.members.length > 0
                ? p.members.map((m) => m.name || m).join(', ')
                : p.teamMembers || 'Ungrouped',
            currentGuide: p.guide?.name || 'None',
          }))
        );
      }
      setLoadingProjects(false);
    };

    fetchGuides();
    fetchProjects();
  }, []);

  const handleAssignGuide = async (projectId, guideId) => {
    const guideName = allocations.find((g) => g.id === guideId)?.guide;
    const toastId = toast.loading('Assigning guide...');
    try {
      const res = await projectService.updateProject(projectId, {
        guide: guideId,
      });
      if (res.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? { ...p, currentGuide: guideName || 'Assigned' }
              : p
          )
        );
        notifyDataChanged({ type: 'guide_assigned', projectId, guideId });
        toast.success(`Guide ${guideName ? `(${guideName})` : ''} assigned successfully!`, { id: toastId });
      } else {
        toast.error('Failed to assign guide: ' + (res.message || 'Error occurred'), { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to assign guide', { id: toastId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='project-page animate-fade-in text-gray-600 dark:text-gray-400 print:p-0'>
      <div className='project-header no-print'>
        <div>
          <h2 className='project-title text-gray-900 dark:text-white'>
            Guide Allocation
          </h2>
          <p className='project-subtitle'>
            Manage mentor assignments and capacity
          </p>
        </div>
        <button
          onClick={handlePrint}
          className='project-btn project-btn-secondary'
        >
          Print Report
        </button>
      </div>

      {/* Guides Grid */}
      <div className='no-print space-y-4'>
        <h3 className='text-xs font-bold tracking-widest text-gray-400'>
          Mentor Availability
        </h3>
        {loadingGuides ? (
          <div className='py-10 text-center text-sm text-gray-400'>
            Loading mentors...
          </div>
        ) : allocations.length === 0 ? (
          <div className='rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-sm text-gray-400 dark:bg-slate-800'>
            No mentors found matching criteria.
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {allocations.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </div>

      {/* Projects Table */}
      <div className='project-card-simple overflow-hidden print:border-none'>
        <div className='no-print flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700'>
          <h3 className='font-bold tabular-nums text-gray-900 dark:text-white'>
            Allocation Management
          </h3>
          <span className='rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold tracking-tighter text-indigo-600'>
            Total Projects: {projects.length}
          </span>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-gray-50 dark:bg-slate-900/50'>
              <tr>
                <th className='px-6 py-3 text-[10px] font-bold tracking-wider text-gray-400'>
                  ID
                </th>
                <th className='px-6 py-3 text-[10px] font-bold tracking-wider text-gray-400'>
                  Name
                </th>
                <th className='px-6 py-3 text-[10px] font-bold tracking-wider text-gray-400'>
                  Group
                </th>
                <th className='px-6 py-3 text-[10px] font-bold tracking-wider text-gray-400'>
                  Guide
                </th>
                <th className='no-print px-6 py-3 text-[10px] font-bold tracking-wider text-gray-400'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-slate-800'>
              {loadingProjects ? (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-10 text-center text-sm text-gray-400'
                  >
                    Fetching projects data...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-10 text-center text-sm text-gray-400'
                  >
                    All projects have been allocated guides.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <AllocationRow
                    key={project.id}
                    project={project}
                    availableGuides={allocations}
                    onAssign={handleAssignGuide}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

GuideAllocationList.displayName = 'GuideAllocationList';
export default GuideAllocationList;
