/**
 * UpdateProgressModal Component
 * Interactive slider & status update modal.
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { TrendingUp } from 'lucide-react';
import projectService from '../../../../services/projectService';
import {
  Modal,
  FormGroup,
  Select,
  TextArea,
  PrimaryButton,
  SecondaryButton,
} from '../ui';

const UpdateProgressModal = ({ isOpen, onClose, project, onSuccess }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('in_progress');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      setProgress(project.progress || 0);
      setStatus(project.status || 'in_progress');
      setNote('');
    }
  }, [isOpen, project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;
    try {
      setSubmitting(true);
      const toastId = toast.loading('Updating progress...');
      await projectService.updateProgress(project._id || project.id, {
        progress,
        status,
        note,
      });
      toast.success('Project progress updated!', { id: toastId });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to update progress'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Update Progress & Status'
      subtitle={project?.title}
      icon={TrendingUp}
      iconColor='bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-5'>
        {/* Progress Slider */}
        <FormGroup label={`Completion Percentage (${progress}%)`}>
          <input
            type='range'
            min='0'
            max='100'
            value={progress}
            onChange={(e) => {
              const val = Number(e.target.value);
              setProgress(val);
              if (val === 100) setStatus('completed');
            }}
            className='h-2.5 w-full cursor-pointer rounded-lg bg-gray-200 dark:bg-slate-700 accent-blue-600'
          />
        </FormGroup>

        {/* Status Picker */}
        <FormGroup label='Project Status'>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value='assigned'>Assigned</option>
            <option value='planning'>Planning</option>
            <option value='in_progress'>In Progress</option>
            <option value='under_review'>Under Review</option>
            <option value='approved'>Approved</option>
            <option value='completed'>Completed</option>
            <option value='rejected'>Rejected</option>
          </Select>
        </FormGroup>

        {/* Milestone Note */}
        <FormGroup label='Milestone / Activity Note'>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='Add a comment regarding this milestone update...'
            rows={3}
          />
        </FormGroup>

        <div className='flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-slate-700'>
          <SecondaryButton type='button' onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type='submit'
            disabled={submitting}
            className='!bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800'
          >
            {submitting ? 'Saving...' : 'Update Progress'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProgressModal;
