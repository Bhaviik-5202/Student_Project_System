import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

const SupportTicket = memo(() => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: '',
    attachments: [],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!ticket.subject.trim() || !ticket.description.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      setLoading(true);

      try {
        await api.post('/supporttickets', {
          subject: ticket.subject,
          description: ticket.description,
        });
        toast.success('Support ticket submitted successfully');
        navigate('/help');
      } catch (error) {
        console.error('Failed to submit ticket', error);
        toast.error(error.response?.data?.message || 'Failed to submit ticket');
      } finally {
        setLoading(false);
      }
    },
    [ticket, navigate]
  );

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate('/help')}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            ← Back to Help Center
          </button>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Submit Support Ticket
          </h1>
          <p className='text-slate-600 dark:text-slate-400'>
            Need help? Submit a ticket and our team will assist you
          </p>
        </div>

        <div className='max-w-3xl rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Subject
              </label>
              <input
                type='text'
                required
                className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700  dark:focus:ring-blue-400'
                value={ticket.subject}
                onChange={(e) =>
                  setTicket({ ...ticket, subject: e.target.value })
                }
                placeholder='Brief description of your issue'
              />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Category
                </label>
                <select
                  className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700  dark:focus:ring-blue-400'
                  value={ticket.category}
                  onChange={(e) =>
                    setTicket({ ...ticket, category: e.target.value })
                  }
                >
                  <option value='technical'>Technical Issue</option>
                  <option value='account'>Account Problem</option>
                  <option value='feature'>Feature Request</option>
                  <option value='billing'>Billing Question</option>
                  <option value='other'>Other</option>
                </select>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Priority
                </label>
                <select
                  className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700  dark:focus:ring-blue-400'
                  value={ticket.priority}
                  onChange={(e) =>
                    setTicket({ ...ticket, priority: e.target.value })
                  }
                >
                  <option value='low'>Low</option>
                  <option value='medium'>Medium</option>
                  <option value='high'>High</option>
                  <option value='urgent'>Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Description
              </label>
              <textarea
                rows='6'
                required
                className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700  dark:focus:ring-blue-400'
                value={ticket.description}
                onChange={(e) =>
                  setTicket({ ...ticket, description: e.target.value })
                }
                placeholder='Please describe your issue in detail...'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Attachments (Optional)
              </label>
              <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 dark:bg-slate-800 p-6 text-center dark:border-slate-600 dark:bg-slate-700/50'>
                <input
                  type='file'
                  multiple
                  className='hidden'
                  id='file-upload'
                  onChange={(e) =>
                    setTicket({
                      ...ticket,
                      attachments: Array.from(e.target.files),
                    })
                  }
                />
                <label htmlFor='file-upload' className='cursor-pointer'>
                  <div className='text-slate-600 dark:text-slate-400'>
                    <svg
                      className='mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 dark:text-slate-400'
                      stroke='currentColor'
                      fill='none'
                      viewBox='0 0 48 48'
                    >
                      <path
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <p className='mt-2'>Click to upload screenshots or files</p>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className='flex flex-col-reverse sm:flex-row gap-3 pt-2'>
              <button
                type='button'
                onClick={() => navigate('/help')}
                className='w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className='w-full sm:w-auto flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

SupportTicket.displayName = 'SupportTicket';

export default SupportTicket;
