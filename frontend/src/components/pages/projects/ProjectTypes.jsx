import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Search as SearchIcon,
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import api from '../../../utils/api';

const ProjectArchitectureCard = memo(({ architecture, onEdit, onDelete }) => (
  <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800'>
    <div className='mb-4 flex items-start justify-between gap-4'>
      <div className='flex-1'>
        <div className='mb-1 flex items-center gap-2'>
          <h3 className='text-lg font-bold leading-tight text-gray-900 dark:text-white'>
            {architecture.name}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${architecture.status === 'Active'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
              }`}
          >
            {architecture.status || 'Active'}
          </span>
        </div>
        <span className='mb-2 block text-[10px] font-bold uppercase tracking-widest text-indigo-500'>
          {architecture.category || 'General'}
        </span>
        <p className='line-clamp-2 text-sm text-gray-500 dark:text-gray-400'>
          {architecture.description}
        </p>
      </div>

      <div className='flex gap-2'>
        <button
          onClick={() => onEdit(architecture._id || architecture.id)}
          className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30'
          title='Edit'
        >
          <EditIcon size={16} />
        </button>
        <button
          onClick={() => onDelete(architecture._id || architecture.id)}
          className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30'
          title='Delete'
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </div>

    <div className='grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 dark:border-slate-700'>
      <div className='flex items-center gap-2'>
        <CalendarIcon size={14} className='text-gray-400' />
        <div className='flex flex-col'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
            Timeline
          </span>
          <span className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
            {architecture.duration}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <UsersIcon size={14} className='text-gray-400' />
        <div className='flex flex-col'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
            Team Size
          </span>
          <span className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
            {architecture.maxStudents} Students
          </span>
        </div>
      </div>
    </div>

    <div className='mt-4 flex justify-end border-t border-gray-50 pt-4 dark:border-slate-700'>
      <button
        onClick={() => onEdit(architecture._id || architecture.id)}
        className='flex items-center gap-1 text-xs font-bold text-indigo-600 transition-all hover:text-indigo-700'
      >
        Manage Configuration <ChevronRightIcon size={14} />
      </button>
    </div>
  </div>
));

ProjectArchitectureCard.displayName = 'ProjectArchitectureCard';

const ProjectArchitecturesList = memo(() => {
  const navigate = useNavigate();
  const [architectures, setArchitectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

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

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Confirm deletion?')) return;
      const toastId = toast.loading('Processing...');
      try {
        const res = await api.delete(`/projects/types/${id}`);
        if (res.success) {
          toast.success('Architecture deleted', { id: toastId });
          fetchArchitectures();
        } else {
          toast.error(res.message || 'Deletion failed', { id: toastId });
        }
      } catch (error) {
        toast.error('Error occurred', { id: toastId });
      }
    },
    [fetchArchitectures]
  );

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='flex items-center text-xl font-bold text-gray-900 dark:text-white'>
            Project Types
          </h2>
          <p className='text-sm text-gray-500'>
            Manage project classification templates
          </p>
        </div>
        <button
          onClick={() => navigate('/project-types/new')}
          className='flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700'
        >
          <i className='fas fa-plus mr-2'></i> New Definition
        </button>
      </div>

      <div className='flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row'>
        <div className='relative flex-1'>
          <SearchIcon
            size={16}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            placeholder='Search definitions...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-lg border border-transparent bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 dark:bg-slate-900 dark:text-white'
          />
        </div>
        <div className='flex gap-2 overflow-x-auto pb-1 md:pb-0'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${filterCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && architectures.length === 0 ? (
        <div className='py-20 text-center text-sm italic text-gray-400'>
          Loading definitions...
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredArchitectures.length > 0 ? (
            filteredArchitectures.map((arch) => (
              <ProjectArchitectureCard
                key={arch._id || arch.id}
                architecture={arch}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className='col-span-full rounded-xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center dark:border-slate-700 dark:bg-slate-800'>
              <p className='text-sm text-gray-400'>
                No architectures found matching your criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProjectArchitecturesList.displayName = 'ProjectArchitecturesList';
export default ProjectArchitecturesList;
