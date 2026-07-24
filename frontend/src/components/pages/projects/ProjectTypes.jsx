import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FolderKanban,
  Plus,
  Trash2 as TrashIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import api from '../../../utils/api';
import {
  PageHeader,
  Card,
  Badge,
  StatusBadge,
  SearchInput,
  PrimaryButton,
  IconButton,
  LoadingState,
  EmptyState,
  ConfirmationModal,
} from './ui';

const ProjectArchitectureCard = memo(({ architecture, onEdit, onDelete }) => (
  <Card className='flex flex-col justify-between space-y-4 !p-5'>
    <div>
      <div className='mb-3 flex items-start justify-between gap-3'>
        <div className='flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <h3 className='text-base font-bold leading-tight text-gray-900 dark:text-white'>
              {architecture.name}
            </h3>
            <StatusBadge status={architecture.status || 'Active'} />
          </div>
          <Badge variant='indigo' className='!px-2 !py-0.5 mt-1'>
            {architecture.category || 'General'}
          </Badge>
        </div>

        <IconButton
          icon={TrashIcon}
          variant='danger'
          title='Delete Architecture'
          onClick={() => onDelete(architecture._id || architecture.id)}
        />
      </div>

      <p className='line-clamp-2 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 leading-relaxed'>
        {architecture.description}
      </p>
    </div>

    <div>
      <div className='grid grid-cols-2 gap-4 border-t border-gray-100 pt-3 dark:border-slate-700'>
        <div className='flex items-center gap-2'>
          <CalendarIcon size={14} className='text-gray-400 dark:text-gray-500 shrink-0' />
          <div className='flex flex-col'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
              Timeline
            </span>
            <span className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
              {architecture.duration}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <UsersIcon size={14} className='text-gray-400 dark:text-gray-500 shrink-0' />
          <div className='flex flex-col'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
              Team Size
            </span>
            <span className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
              {architecture.maxStudents} Students
            </span>
          </div>
        </div>
      </div>

      <div className='mt-4 flex justify-end border-t border-gray-100 pt-3 dark:border-slate-700'>
        <button
          onClick={() => onEdit(architecture._id || architecture.id)}
          className='flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-400 dark:text-indigo-400 dark:text-indigo-300 transition-all'
        >
          Manage Configuration <ChevronRightIcon size={14} />
        </button>
      </div>
    </div>
  </Card>
));

ProjectArchitectureCard.displayName = 'ProjectArchitectureCard';

const ProjectArchitecturesList = memo(() => {
  const navigate = useNavigate();
  const [architectures, setArchitectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [architectureToDelete, setArchitectureToDelete] = useState(null);

  const DEFAULT_ARCHITECTURES = [
    { _id: '1', name: 'Web Application', category: 'Software Development', description: 'Full stack responsive web platform architecture using modern frameworks.', duration: '16 Weeks', maxStudents: 4, status: 'Active' },
    { _id: '2', name: 'Mobile Application', category: 'Software Development', description: 'Native and cross-platform mobile apps for iOS and Android devices.', duration: '14 Weeks', maxStudents: 3, status: 'Active' },
    { _id: '3', name: 'AI / Machine Learning', category: 'Data Science', description: 'Deep learning models, predictive analysis, and intelligent automation systems.', duration: '20 Weeks', maxStudents: 2, status: 'Active' },
    { _id: '4', name: 'Cyber Security', category: 'Security & Networks', description: 'Vulnerability assessment, penetration testing, and security auditing framework.', duration: '12 Weeks', maxStudents: 3, status: 'Active' },
    { _id: '5', name: 'Cloud & DevOps', category: 'Infrastructure', description: 'Microservices architecture, CI/CD pipelines, and cloud containerization.', duration: '16 Weeks', maxStudents: 4, status: 'Active' },
    { _id: '6', name: 'IoT & Embedded Systems', category: 'Hardware & Systems', description: 'Smart hardware integration, microcontrollers, and sensor telemetry.', duration: '18 Weeks', maxStudents: 4, status: 'Active' },
  ];

  const fetchArchitectures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects/types');
      const rawData = response?.data || response;
      const typesList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
          ? rawData.data
          : [];

      setArchitectures(typesList.length > 0 ? typesList : DEFAULT_ARCHITECTURES);
    } catch (error) {
      console.warn('Could not fetch project types API, using standard templates:', error);
      setArchitectures(DEFAULT_ARCHITECTURES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchitectures();
  }, [fetchArchitectures]);

  const filteredArchitectures = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return architectures.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query);
      const matchesFilter =
        filterCategory === 'All' || a.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [architectures, searchQuery, filterCategory]);

  const categories = useMemo(() => {
    const cats = new Set(architectures.map((a) => a.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [architectures]);

  const handleEdit = useCallback(
    (id) => {
      if (!id) {
        toast.error('Invalid Architecture ID');
        return;
      }
      navigate(`/project-types/${id}/edit`);
    },
    [navigate]
  );

  const confirmDelete = useCallback(
    async () => {
      if (!architectureToDelete) return;
      const toastId = toast.loading('Processing deletion...');
      try {
        const res = await api.delete(`/projects/types/${architectureToDelete}`);
        if (res.success) {
          toast.success('Architecture deleted', { id: toastId });
          fetchArchitectures();
        } else {
          toast.error(res.message || 'Deletion failed', { id: toastId });
        }
      } catch (error) {
        toast.error('Error occurred', { id: toastId });
      } finally {
        setArchitectureToDelete(null);
      }
    },
    [architectureToDelete, fetchArchitectures]
  );

  return (
    <div className='space-y-6 pt-0 pb-6 animate-fade-in'>
      <PageHeader
        title='Project Types'
        subtitle='Manage project classification templates & architectures'
        icon={FolderKanban}
        actions={
          <PrimaryButton
            icon={Plus}
            onClick={() => navigate('/project-types/new')}
          >
            New Definition
          </PrimaryButton>
        }
      />

      <Card className='flex flex-col items-center gap-4 md:flex-row !p-4'>
        <SearchInput
          placeholder='Search definitions...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-1 w-full'
        />
        <div className='flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 dark:bg-slate-700 '
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {loading && architectures.length === 0 ? (
        <LoadingState message='Loading definitions...' />
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredArchitectures.length > 0 ? (
            filteredArchitectures.map((arch) => (
              <ProjectArchitectureCard
                key={arch._id || arch.id}
                architecture={arch}
                onEdit={handleEdit}
                onDelete={(id) => setArchitectureToDelete(id)}
              />
            ))
          ) : (
            <div className='col-span-full'>
              <EmptyState
                title='No Architectures Found'
                description='No project architecture definitions match your criteria.'
                icon={FolderKanban}
              />
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={Boolean(architectureToDelete)}
        onClose={() => setArchitectureToDelete(null)}
        onConfirm={confirmDelete}
        title='Delete Project Definition'
        message='Are you sure you want to delete this project architecture definition?'
        isDanger
        confirmText='Delete'
      />
    </div>
  );
});

ProjectArchitecturesList.displayName = 'ProjectArchitecturesList';
export default ProjectArchitecturesList;
