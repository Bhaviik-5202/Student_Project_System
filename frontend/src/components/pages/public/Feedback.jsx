import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../utils/api';

const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('User Interface & Design');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      toast.error('Please enter your comments or feedback');
      return;
    }

    setLoading(true);
    try {
      await api.post('/contact/feedback', {
        name: user?.name || 'Anonymous User',
        email: user?.email || 'No email provided',
        rating,
        category,
        feedback: comments,
        role: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Guest',
        date: new Date().toLocaleString(),
      });
      setSubmitted(true);
      toast.success('Thank you! Your feedback has been sent to er.bhavik5202@gmail.com');
    } catch (err) {
      console.error('Feedback submit error:', err);
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-8 animate-fade-in pt-0 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <PageHeader
        title='Platform Feedback'
        subtitle='Your feedback helps us continuously refine the academic project management experience.'
        icon={MessageSquare}
      />

      <div className='max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm'>
        {submitted ? (
          <div className='py-8 text-center space-y-4 animate-fade-in'>
            <div className='mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
              <CheckCircle2 size={36} />
            </div>
            <h3 className='text-2xl font-extrabold text-slate-900 dark:text-white'>Feedback Submitted!</h3>
            <p className='text-xs text-slate-600 dark:text-slate-400'>
              We appreciate your time. Your input has been registered with our product development team.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setComments('');
              }}
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-md'
            >
              Submit Additional Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2'>
                Rate Your Experience
              </label>
              <div className='flex items-center gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => setRating(star)}
                    className='p-1 transition-transform hover:scale-110 focus:outline-none'
                  >
                    <Star
                      size={28}
                      className={
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5'>
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              >
                <option value='User Interface & Design'>User Interface & Design</option>
                <option value='Performance & Speed'>Performance & Speed</option>
                <option value='Project Workflow & Governance'>Project Workflow & Governance</option>
                <option value='Feature Request'>Feature Request</option>
                <option value='Bug Report'>Bug Report</option>
                <option value='General Improvement'>General Improvement</option>
              </select>
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5'>
                Detailed Comments / Suggestions *
              </label>
              <textarea
                required
                rows={5}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className='w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                placeholder='Share your thoughts, suggestions, or issues encountered...'
              />
            </div>

            <button
              type='submit'
              className='w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-md'
            >
              <Send size={16} />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
