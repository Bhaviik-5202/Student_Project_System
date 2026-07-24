/**
 * AssignGuideModal Component
 * Searchable faculty guide selector modal.
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Check, Award } from 'lucide-react';
import projectService from '../../../../services/projectService';
import {
  Modal,
  SearchInput,
  PrimaryButton,
  SecondaryButton,
  LoadingState,
  EmptyState,
} from '../ui';

const AssignGuideModal = ({ isOpen, onClose, project, onSuccess }) => {
  const [activeFaculty, setActiveFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      const guideId = project.guide
        ? typeof project.guide === 'object'
          ? project.guide._id || project.guide.id
          : project.guide
        : '';
      setSelectedGuideId(guideId);
      loadActiveFaculty('');
    }
  }, [isOpen, project]);

  const loadActiveFaculty = async (query) => {
    try {
      setLoading(true);
      const data = await projectService.getActiveFaculty(query);
      setActiveFaculty(data || []);
    } catch (error) {
      toast.error('Failed to load active faculty guides');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    loadActiveFaculty(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;
    try {
      setSubmitting(true);
      const toastId = toast.loading('Updating guide allocation...');
      await projectService.assignGuide(
        project._id || project.id,
        selectedGuideId || null
      );
      toast.success('Faculty guide allocated successfully!', { id: toastId });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update guide');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Allocate Faculty Guide'
      subtitle={`Project: ${project?.title || ''}`}
      icon={Award}
      iconColor='bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-4'>
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder='Search faculty guides by name or department...'
        />

        <div className='max-h-64 overflow-y-auto space-y-2 pr-1'>
          {loading ? (
            <LoadingState message='Loading faculty directory...' />
          ) : activeFaculty.length === 0 ? (
            <EmptyState
              title='No Faculty Found'
              description='No faculty guides match your search criteria.'
              icon={Award}
            />
          ) : (
            activeFaculty.map((faculty) => {
              const facId = faculty._id || faculty.id;
              const isSelected = selectedGuideId === facId;
              return (
                <div
                  key={facId}
                  onClick={() => setSelectedGuideId(facId)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50 dark:border-purple-500 dark:bg-purple-900/20'
                      : 'border-gray-100 hover:border-gray-200 dark:border-slate-700 dark:hover:border-slate-600'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-bold text-xs text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'>
                      {faculty.name ? faculty.name.charAt(0).toUpperCase() : 'F'}
                    </div>
                    <div>
                      <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {faculty.name}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {faculty.designation || 'Faculty Guide'} • {faculty.department || 'Department'}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 dark:bg-purple-500 text-white'
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className='flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-700'>
          <button
            type='button'
            onClick={() => setSelectedGuideId('')}
            className='text-xs font-semibold text-red-600 hover:underline dark:text-red-400'
          >
            Unassign Guide
          </button>

          <div className='flex gap-3'>
            <SecondaryButton type='button' onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type='submit'
              disabled={submitting}
              className='!bg-gradient-to-r !from-purple-600 !to-purple-700 hover:!from-purple-700 hover:!to-purple-800'
            >
              {submitting ? 'Saving...' : 'Confirm Allocation'}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AssignGuideModal;
