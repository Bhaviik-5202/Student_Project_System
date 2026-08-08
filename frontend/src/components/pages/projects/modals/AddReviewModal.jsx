/**
 * AddReviewModal Component
 * Faculty evaluation and rating submission modal.
 */
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Star } from 'lucide-react';
import projectService from '../../../../services/projectService';
import {
  Modal,
  FormGroup,
  Select,
  TextArea,
  PrimaryButton,
  SecondaryButton,
} from '../ui';

const AddReviewModal = ({ isOpen, onClose, project, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [milestone, setMilestone] = useState('Mid-Term Review');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please provide review feedback comments');
      return;
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading('Submitting faculty evaluation...');
      await projectService.addProjectReview(project._id || project.id, {
        rating,
        milestone,
        comment,
      });
      toast.success('Faculty review submitted successfully!', { id: toastId });
      setComment('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Faculty Evaluation & Feedback'
      subtitle={project?.title}
      icon={Star}
      iconColor='bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-4'>
        <FormGroup label='Evaluation Stage / Milestone'>
          <Select
            value={milestone}
            onChange={(e) => setMilestone(e.target.value)}
          >
            <option value='Proposal Review'>Proposal Review</option>
            <option value='Mid-Term Review'>Mid-Term Review</option>
            <option value='Pre-Final Presentation'>
              Pre-Final Presentation
            </option>
            <option value='Final Viva Evaluation'>Final Viva Evaluation</option>
            <option value='General Feedback'>General Feedback</option>
          </Select>
        </FormGroup>

        <FormGroup label='Rating (1 to 5 Stars)'>
          <div className='flex items-center gap-2 pt-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                onClick={() => setRating(star)}
                className='p-1 text-amber-400 dark:text-amber-400 transition-transform hover:scale-125 focus:outline-none'
              >
                <Star
                  size={26}
                  fill={star <= rating ? 'currentColor' : 'none'}
                  className={
                    star <= rating
                      ? 'text-amber-400 dark:text-amber-400'
                      : 'text-gray-300 dark:text-slate-600'
                  }
                />
              </button>
            ))}
            <span className='ml-2 text-xs font-bold text-gray-700 dark:text-gray-300'>
              {rating} / 5 Stars
            </span>
          </div>
        </FormGroup>

        <FormGroup label='Evaluation Comments & Feedback' required>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Provide constructive evaluation feedback for the student team...'
            rows={4}
            required
          />
        </FormGroup>

        <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100 pt-4 dark:border-slate-700'>
          <SecondaryButton
            type='button'
            onClick={onClose}
            className='w-full sm:w-auto justify-center'
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type='submit'
            disabled={submitting}
            className='w-full sm:w-auto justify-center !bg-gradient-to-r !from-amber-600 !to-amber-700 hover:!from-amber-700 hover:!to-amber-800'
          >
            {submitting ? 'Submitting...' : 'Submit Evaluation'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddReviewModal;
