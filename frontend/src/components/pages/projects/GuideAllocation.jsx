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
        <div className='rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800/60 dark:bg-amber-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 shrink-0'>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className='text-sm font-bold text-amber-900 dark:text-amber-200'>
                {unassignedProjects.length} Projects Pending Guide Allocation
              </h3>
              <p className='text-xs text-amber-700 dark:text-amber-300'>
                Some student project teams currently do not have an assigned faculty mentor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Workload Grid */}
      <div className='space-y-4'>
        <div className='max-w-md'>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search faculty guides...'
          />
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {facultyList.map((faculty) => {
              const facId = faculty._id || faculty.id;
              const guidedProjects = projects.filter((p) => {
                if (!p.guide) return false;
                const gId = typeof p.guide === 'object' ? p.guide._id || p.guide.id : p.guide;
                return gId === facId;
              });

              return (
                <Card
                  key={facId}
                  className='space-y-4 !p-5'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 font-extrabold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 shrink-0'>
                      {faculty.name ? faculty.name.charAt(0).toUpperCase() : 'F'}
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-gray-900 dark:text-white'>
                        {faculty.name}
                      </h3>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {faculty.designation || 'Faculty'} • {faculty.department || 'Department'}
                      </p>
                    </div>
                  </div>

                  <div className='border-t border-gray-100 pt-3 dark:border-slate-700 space-y-2'>
                    <div className='flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400'>
                      <span>Guided Projects:</span>
                      <span className='text-purple-600 dark:text-purple-400 font-extrabold'>
                        {guidedProjects.length} Projects
                      </span>
                    </div>

                    <div className='space-y-1.5 max-h-36 overflow-y-auto pr-1'>
                      {guidedProjects.length === 0 ? (
                        <p className='text-[11px] text-gray-400 italic py-2'>No active projects assigned</p>
                      ) : (
                        guidedProjects.map((proj) => (
                          <div
                            key={proj._id || proj.id}
                            onClick={() => navigate(`/projects/${proj.slug || proj._id || proj.id}`)}
                            className='flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-900/80 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors'
                          >
                            <span className='text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[180px]'>
                              {proj.title}
                            </span>
                            <Badge variant='purple'>{proj.code || 'PRJ'}</Badge>
                          </div>
                        ))
                      )}
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
