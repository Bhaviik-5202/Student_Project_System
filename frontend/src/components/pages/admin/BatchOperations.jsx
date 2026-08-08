import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Layers, Mail, Bell, Download } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';

const BatchOperations = memo(() => {
  const navigate = useNavigate();
  const [operation, setOperation] = useState('email');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(
          (response.data || []).map((u) => ({
            ...u,
            id: u._id || u.id,
            selected: false,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUserSelection = useCallback((userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedUsers((prev) =>
      prev.length === users.length ? [] : users.map((user) => user.id)
    );
  }, [users]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (selectedUsers.length === 0) {
        toast.error('Please select at least one user');
        return;
      }

      setLoading(true);
      try {
        await api.post('/admin/batch-operation', {
          operation,
          selectedUsers,
          message,
        });
        toast.success(
          `${operation.charAt(0).toUpperCase() + operation.slice(1)} operation completed for ${selectedUsers.length} users`
        );
        setMessage('');
        setSelectedUsers([]);
      } catch (error) {
        console.error('Batch operation failed', error);
        toast.error('Batch operation failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [operation, selectedUsers, message]
  );

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Batch Operations'
        subtitle='Perform bulk operations on multiple user accounts at once'
        icon={Layers}
      />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Operation Settings */}
        <div className='lg:col-span-2'>
          <div className='mb-6 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Operation Settings
            </h3>

            <div className='mb-6'>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Operation Type
              </label>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {[
                  {
                    id: 'email',
                    label: 'Send Email',
                    icon: <Mail size={24} className='mx-auto' />,
                  },
                  {
                    id: 'notification',
                    label: 'Send Notification',
                    icon: <Bell size={24} className='mx-auto' />,
                  },
                  {
                    id: 'export',
                    label: 'Export Data',
                    icon: <Download size={24} className='mx-auto' />,
                  },
                ].map((op) => (
                  <button
                    key={op.id}
                    type='button'
                    onClick={() => setOperation(op.id)}
                    className={`rounded-lg border px-4 py-3 text-center transition-colors ${
                      operation === op.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className='mb-2 text-xl'>{op.icon}</div>
                    <div className='font-medium'>{op.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                {operation === 'email'
                  ? 'Email Message'
                  : operation === 'notification'
                    ? 'Notification Message'
                    : 'Export Settings'}
              </label>
              {operation === 'export' ? (
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                      Format
                    </label>
                    <select className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700  dark:focus:ring-blue-600'>
                      <option>CSV</option>
                      <option>Excel</option>
                      <option>PDF</option>
                    </select>
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                      Include Data
                    </label>
                    <div className='space-y-2'>
                      {[
                        'User Information',
                        'Project Data',
                        'Grades',
                        'Activity Logs',
                      ].map((item, idx) => (
                        <label key={idx} className='flex items-center'>
                          <input
                            type='checkbox'
                            defaultChecked
                            className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600'
                          />
                          <span className='ml-2 text-slate-700 dark:text-slate-300'>
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <textarea
                  rows='6'
                  className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700  dark:focus:ring-blue-600'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Enter your ${
                    operation === 'email' ? 'email' : 'notification'
                  } message here...`}
                />
              )}
            </div>
          </div>
        </div>

        {/* User Selection */}
        <div>
          <div className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                Select Users
              </h3>
              <button
                onClick={toggleSelectAll}
                className='text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
              >
                {selectedUsers.length === users.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            <div className='max-h-96 space-y-3 overflow-y-auto'>
              {usersLoading ? (
                <div className='py-4 text-center text-slate-500 dark:text-slate-400'>
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className='py-4 text-center text-slate-500 dark:text-slate-400'>
                  No users found.
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className='flex items-center rounded-lg border border-slate-200 p-3 dark:border-slate-700'
                  >
                    <input
                      type='checkbox'
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600'
                    />
                    <div className='ml-3'>
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {user.name || user.firstName + ' ' + user.lastName}
                      </div>
                      <div className='text-sm text-slate-600 dark:text-slate-400'>
                        {user.email}
                      </div>
                      <div className='text-xs text-slate-500 dark:text-slate-400'>
                        {user.role}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className='mt-6 border-t border-slate-200 pt-6 dark:border-slate-700'>
              <div className='mb-4 text-sm text-slate-600 dark:text-slate-400'>
                Selected: {selectedUsers.length} users
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || selectedUsers.length === 0}
                className='w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800'
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <div className='mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                    Processing...
                  </div>
                ) : (
                  `Execute ${
                    operation === 'email'
                      ? 'Email'
                      : operation === 'notification'
                        ? 'Notification'
                        : 'Export'
                  } Operation`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BatchOperations.displayName = 'BatchOperations';

export default BatchOperations;
