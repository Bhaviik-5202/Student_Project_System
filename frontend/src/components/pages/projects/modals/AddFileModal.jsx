/**
 * AddFileModal Component
 * Upload or attach link modal for project files.
 */
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FilePlus, Link as LinkIcon } from 'lucide-react';
import projectService from '../../../../services/projectService';
import {
  Modal,
  FormGroup,
  Input,
  Select,
  PrimaryButton,
  SecondaryButton,
} from '../ui';

const AddFileModal = ({ isOpen, onClose, project, onSuccess }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [fileType, setFileType] = useState('Document');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      toast.error('File name and URL are required');
      return;
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading('Attaching document...');
      await projectService.addProjectFile(project._id || project.id, {
        name,
        url,
        fileType,
        size: 'N/A',
      });
      toast.success('Document attached successfully!', { id: toastId });
      setName('');
      setUrl('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to attach file');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Attach Project Document / Link'
      subtitle={project?.title}
      icon={FilePlus}
      iconColor='bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-4'>
        <FormGroup label='Document Name' required>
          <Input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g. System Architecture Diagram PDF'
            required
          />
        </FormGroup>

        <FormGroup label='Resource URL' required>
          <div className='relative'>
            <LinkIcon size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <Input
              type='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='https://drive.google.com/... or GitHub URL'
              className='pl-10'
              required
            />
          </div>
        </FormGroup>

        <FormGroup label='Category / Type'>
          <Select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value='Document'>Document Report</option>
            <option value='Presentation'>Slide Presentation</option>
            <option value='Diagram'>Architecture / Diagram</option>
            <option value='Source Code'>Source Repository Link</option>
            <option value='Other'>Other Material</option>
          </Select>
        </FormGroup>

        <div className='flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-slate-700'>
          <SecondaryButton type='button' onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type='submit'
            disabled={submitting}
            className='!bg-gradient-to-r !from-emerald-600 !to-emerald-700 hover:!from-emerald-700 hover:!to-emerald-800'
          >
            {submitting ? 'Attaching...' : 'Attach File'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddFileModal;
