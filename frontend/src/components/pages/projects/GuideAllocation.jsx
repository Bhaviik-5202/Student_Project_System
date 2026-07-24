/**
 * GuideAllocation Component
 * Dedicated Faculty Guide Workload & Allocation View.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Award, AlertTriangle } from 'lucide-react';
import projectService from '../../../services/projectService';
import AssignGuideModal from './modals/AssignGuideModal';
import {
  PageHeader,
  Card,
  SearchInput,
  LoadingState,
  EmptyState,
  Badge,
} from './ui';

const GuideAllocation = () => {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [facData, projData] = await Promise.all([
        projectService.getActiveFaculty(search),
        projectService.getAllProjects({ limit: 100 }),
      ]);
      setFacultyList(facData || []);
      setProjects(projData.projects || []);
    } catch (err) {
      console.error('Failed to load guide allocation data', err);
      toast.error('Failed to load guide allocation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  // Unassigned projects list
  const unassignedProjects = projects.filter((p) => !p.guide);

  return (
    <div className='space-y-6 p-4 md:p-6 animate-fade-in'>
      <PageHeader
        title='Faculty Guide Allocation & Workload'
        subtitle='Manage faculty mentor assignments across student project groups'
        icon={Award}
        iconColor='text-purple-600 dark:text-purple-400'
      />

      {/* Unassigned Projects Alert Banner */}
      {unassignedProjects.length > 0 && (
        <div className='rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 shadow-xs transition-all dark:border-amber-800/60 dark:bg-amber-950/30'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-start gap-3.5'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <h3 className='text-sm font-bold text-amber-900 dark:text-amber-200'>
                    {unassignedProjects.length} Projects Pending Guide Allocation
                  </h3>
                  <span className='inline-flex items-center rounded-full bg-amber-200/60 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'>
                    Action Required
                  </span>
                </div>
                <p className='mt-0.5 text-xs text-amber-700 dark:text-amber-300/90'>
                  The following project teams require an assigned faculty mentor:
                </p>
              </div>
            </div>
          </div>

          <div className='mt-4 flex flex-wrap gap-2 pt-3 border-t border-amber-200/60 dark:border-amber-800/40'>
            {unassignedProjects.slice(0, 5).map((proj) => (
              <button
                key={proj._id || proj.id}
                onClick={() => {
                  setSelectedProject(proj);
                  setIsModalOpen(true);
                }}
                className='inline-flex items-center gap-2 rounded-xl border border-amber-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs transition hover:bg-amber-100/60 hover:shadow-xs dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-amber-900/40'
              >
                <span>{proj.title}</span>
                <span className='rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'>
                  Assign Guide
                </span>
              </button>
            ))}
            {unassignedProjects.length > 5 && (
              <span className='self-center text-xs font-medium text-amber-700 dark:text-amber-400'>
                +{unassignedProjects.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Faculty Workload Grid */}
      <div className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
            <span>Faculty Mentors & Workload</span>
            <span className='rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400'>
              {facultyList.length} Faculty
            </span>
          </h2>
          <div className='w-full sm:w-72'>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search faculty by name or department...'
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message='Loading faculty workloads...' />
        ) : facultyList.length === 0 ? (
          <EmptyState
            title='No Faculty Members Found'
            description='No faculty records match your search criteria.'
            icon={Award}
          />
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {facultyList.map((faculty) => {
              const facId = faculty._id || faculty.id;
              const guidedProjects = projects.filter((p) => {
                if (!p.guide) return false;
                const gId = typeof p.guide === 'object' ? p.guide._id || p.guide.id : p.guide;
                return gId === facId;
              });

              const projectCount = guidedProjects.length;
              const workloadBadge =
                projectCount === 0
                  ? { label: 'Available', variant: 'emerald', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' }
                  : projectCount <= 2
                  ? { label: 'Light Workload', variant: 'sky', bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800' }
                  : projectCount <= 4
                  ? { label: 'Moderate', variant: 'amber', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' }
                  : { label: 'High Workload', variant: 'rose', bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' };

              return (
                <Card
                  key={facId}
                  className='flex flex-col justify-between space-y-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/90 dark:hover:border-slate-700'
                >
                  <div className='space-y-4'>
                    {/* Faculty Profile Info */}
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex items-center gap-3.5 min-w-0'>
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-white shadow-sm text-base'>
                          {faculty.name ? faculty.name.charAt(0).toUpperCase() : 'F'}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='truncate text-sm font-bold text-gray-900 dark:text-white' title={faculty.name}>
                            {faculty.name}
                          </h3>
                          <p className='truncate text-xs font-medium text-gray-500 dark:text-gray-400'>
                            {faculty.designation || 'Faculty'}
                          </p>
                          <p className='truncate text-[11px] text-gray-400 dark:text-gray-500'>
                            {faculty.department || 'Department'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${workloadBadge.bg}`}>
                        {workloadBadge.label}
                      </span>
                    </div>

                    {/* Guided Projects Header & List */}
                    <div className='space-y-2.5 rounded-xl border border-gray-100 bg-slate-50/60 p-3.5 dark:border-slate-700/60 dark:bg-slate-900/40'>
                      <div className='flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300'>
                        <span className='flex items-center gap-1.5'>
                          <Award size={14} className='text-indigo-600 dark:text-indigo-400' />
                          <span>Guided Projects</span>
                        </span>
                        <span className='rounded-md bg-indigo-50 px-2 py-0.5 font-extrabold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'>
                          {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
                        </span>
                      </div>

                      <div className='space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar'>
                        {guidedProjects.length === 0 ? (
                          <div className='py-4 text-center'>
                            <p className='text-xs text-gray-400 dark:text-gray-500 italic'>
                              No projects currently assigned to this guide.
                            </p>
                          </div>
                        ) : (
                          guidedProjects.map((proj) => (
                            <div
                              key={proj._id || proj.id}
                              onClick={() => navigate(`/projects/${proj.slug || proj._id || proj.id}`)}
                              className='group flex items-center justify-between gap-2 rounded-lg border border-transparent bg-white p-2.5 text-xs shadow-2xs transition-all hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-xs dark:bg-slate-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30 cursor-pointer'
                            >
                              <div className='min-w-0 flex-1'>
                                <p className='truncate font-semibold text-gray-800 group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-400'>
                                  {proj.title}
                                </p>
                              </div>
                              <Badge variant='purple' className='shrink-0 text-[10px] font-bold'>
                                {proj.code || 'PRJ'}
                              </Badge>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AssignGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSuccess={loadData}
      />
    </div>
  );
};

export default GuideAllocation;
