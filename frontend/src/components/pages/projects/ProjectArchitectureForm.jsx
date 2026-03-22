import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import api from '../../../utils/api';

const ProjectArchitectureForm = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    maxStudents: 3,
    category: 'Internal',
    status: 'Active',
  });

  useEffect(() => {
    if (isEditing) {
      const fetchArchitecture = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/projects/types/${id}`);
          const data = response.data || response;
          if (data) {
            setFormData({
              name: data.name || '',
              description: data.description || '',
              duration: data.duration || '',
              maxStudents: data.maxStudents || 3,
              category: data.category || 'Internal',
              status: data.status || 'Active',
            });
          }
        } catch (error) {
          toast.error('Failed to load architecture data');
          navigate('/project-types');
        } finally {
          setLoading(false);
        }
      };
      fetchArchitecture();
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxStudents' ? parseInt(value) || 0 : value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(isEditing ? 'Updating...' : 'Creating...');

    try {
      const res = isEditing
        ? await api.put(`/projects/types/${id}`, formData)
        : await api.post('/projects/types', formData);

      if (
        res.success ||
        res.id ||
        res._id ||
        (res.data && (res.data.id || res.data._id))
      ) {
        toast.success(
          isEditing ? 'Architecture updated' : 'Architecture created',
          { id: toastId }
        );
        navigate('/project-types');
      } else {
        toast.error(res.message || 'Operation failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Error occurred', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='p-20 text-center text-sm italic text-gray-400'>
        Loading configuration...
      </div>
    );
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => navigate('/project-types')}
            className='rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700'
          >
            <ChevronLeftIcon size={20} className='text-gray-400' />
          </button>
          <div className='space-y-1'>
            <h2 className='flex items-center text-xl font-bold text-gray-900 dark:text-white'>
              <i
                className={`fas fa-${isEditing ? 'folder-open' : 'folder-plus'} mr-3 text-gray-400`}
              ></i>
              {isEditing ? 'Edit Architecture' : 'New Architecture'}
            </h2>
            <p className='text-sm text-gray-500'>
              Define the blueprint for project classification
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 gap-6 lg:grid-cols-3'
      >
        <div className='space-y-6 lg:col-span-2'>
          <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-6 text-xs font-bold uppercase tracking-widest text-gray-400'>
              General Information
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Architecture Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900'
                  placeholder='e.g. Research Thesis'
                  required
                />
              </div>

              <div>
                <label className='mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Description / Manifesto
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='min-h-[160px] w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900'
                  placeholder='Define scope, objectives, and limitations...'
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-6 text-xs font-bold uppercase tracking-widest text-gray-400'>
              Operational Data
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Category
                </label>
                <select
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900'
                >
                  <option value='Internal'>Internal</option>
                  <option value='External'>External</option>
                  <option value='Research'>Research</option>
                  <option value='Industry'>Industry</option>
                </select>
              </div>

              <div>
                <label className='mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Timeline (Duration)
                </label>
                <input
                  type='text'
                  name='duration'
                  value={formData.duration}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900'
                  placeholder='e.g. 2 Semesters'
                  required
                />
              </div>

              <div>
                <label className='mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Student Limit
                </label>
                <input
                  type='number'
                  name='maxStudents'
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900'
                  min='1'
                  required
                />
              </div>

              {isEditing && (
                <div>
                  <label className='mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                    Status
                  </label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900'
                  >
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </div>
              )}

              <button
                type='submit'
                disabled={isSubmitting}
                className='flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50 dark:shadow-none'
              >
                {isSubmitting ? (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white' />
                ) : (
                  <i className='fas fa-save mr-2'></i>
                )}
                {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

ProjectArchitectureForm.displayName = 'ProjectArchitectureForm';
export default ProjectArchitectureForm;
