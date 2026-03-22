import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import collaborationService from '../../../services/collaborationService';
import useNotification from '../../../hooks/useNotification';

const DiscussionBoard = memo(() => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  const fetchDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await collaborationService.getDiscussions();
      if (response.success) {
        setDiscussions(response.data);
      }
    } catch (error) {
      showError('Failed to fetch discussions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Discussion Board
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              Participate in discussions and ask questions
            </p>
          </div>
          <button className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'>
            New Discussion
          </button>
        </div>

        <div className='overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-700'>
              <thead className='bg-slate-50 dark:bg-slate-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Discussion Title
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Author
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Replies
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Last Activity
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800'>
                {loading ? (
                  <tr>
                    <td
                      colSpan='6'
                      className='px-6 py-4 text-center text-slate-500'
                    >
                      Loading discussions...
                    </td>
                  </tr>
                ) : discussions.length === 0 ? (
                  <tr>
                    <td
                      colSpan='6'
                      className='px-6 py-4 text-center text-slate-500'
                    >
                      No discussions found.
                    </td>
                  </tr>
                ) : (
                  discussions.map((discussion) => (
                    <tr
                      key={discussion.id || discussion._id}
                      className='hover:bg-slate-50 dark:hover:bg-slate-700'
                    >
                      <td className='px-6 py-4'>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {discussion.title}
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
                        {discussion.author?.name || 'Anonymous'}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            discussion.category === 'Project'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : discussion.category === 'Technical'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : discussion.category === 'Announcement'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                  : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {discussion.category || 'General'}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
                        {discussion.replies?.length || 0}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
                        {new Date(
                          discussion.updatedAt || Date.now()
                        ).toLocaleDateString()}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                        <button
                          onClick={() =>
                            navigate(
                              `/discussions/${discussion.id || discussion._id}`
                            )
                          }
                          className='mr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/discussions/${discussion.id || discussion._id}`
                            )
                          }
                          className='text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

DiscussionBoard.displayName = 'DiscussionBoard';

export default DiscussionBoard;
