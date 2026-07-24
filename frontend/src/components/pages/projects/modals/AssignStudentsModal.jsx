/**
 * AssignStudentsModal Component
 * Searchable active student selection modal with multi-select capabilities.
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Check, UserPlus } from 'lucide-react';
import projectService from '../../../../services/projectService';
import {
  Modal,
  SearchInput,
  PrimaryButton,
  SecondaryButton,
  LoadingState,
  EmptyState,
} from '../ui';

const AssignStudentsModal = ({ isOpen, onClose, project, onSuccess }) => {
  const [activeStudents, setActiveStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      const initialMembers = (project.members || []).map((m) =>
        typeof m === 'object' ? m._id || m.id : m
      );
      setSelectedIds(initialMembers);
      loadActiveStudents('');
    }
  }, [isOpen, project]);

  const loadActiveStudents = async (query) => {
    try {
      setLoading(true);
      const data = await projectService.getActiveStudents(query);
      setActiveStudents(data || []);
    } catch (error) {
      toast.error('Failed to load active students list');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    loadActiveStudents(val);
  };

  const toggleStudent = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;
    try {
      setSubmitting(true);
      const toastId = toast.loading('Updating team assignments...');
      await projectService.assignStudents(
        project._id || project.id,
        selectedIds
      );
      toast.success('Project team members updated successfully!', {
        id: toastId,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update members');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Assign Student Team'
      subtitle={`Project: ${project?.title || ''} (${selectedIds.length} selected)`}
      icon={UserPlus}
      iconColor='bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-4'>
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder='Search students by name, email, or department...'
        />

        <div className='max-h-64 overflow-y-auto space-y-2 pr-1'>
          {loading ? (
            <LoadingState message='Loading student directory...' />
          ) : activeStudents.length === 0 ? (
            <EmptyState
              title='No Students Found'
              description='No active students match your search criteria.'
              icon={UserPlus}
            />
          ) : (
            activeStudents.map((student) => {
              const sId = student._id || student.id;
              const isSelected = selectedIds.includes(sId);
              return (
                <div
                  key={sId}
                  onClick={() => toggleStudent(sId)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-900/20'
                      : 'border-gray-100 hover:border-gray-200 dark:border-slate-700 dark:hover:border-slate-600'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-xs text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'>
                      {student.name
                        ? student.name.charAt(0).toUpperCase()
                        : 'S'}
                    </div>
                    <div>
                      <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {student.name}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {student.studentId ? `ID: ${student.studentId} • ` : ''}
                        {student.department || 'General'}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 dark:bg-indigo-500 text-white'
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

        <div className='flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-slate-700'>
          <SecondaryButton type='button' onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type='submit' disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Team Members'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default AssignStudentsModal;
