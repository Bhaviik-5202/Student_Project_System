import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Users, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';
import '../../../assets/styles/admin.css';

function UserModal({ isOpen, onClose, onSave, user = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'student',
          password: '',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          role: 'student',
          password: '',
        });
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className='fixed inset-0 z-[9999] flex animate-fade-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm'
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className='w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-800'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-indigo-600 px-6 py-4 dark:border-slate-700'>
          <h3 className='flex items-center gap-2 text-lg font-bold text-white'>
            {user ? 'Edit User' : 'Add New User'}
          </h3>
          <button
            onClick={onClose}
            type='button'
            className='text-white/80 transition-colors hover:text-white'
          >
            <span className='text-xl leading-none'>&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4 p-6'>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300'>Full Name</label>
            <input
              type='text'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
              placeholder='John Doe'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300'>Email Address</label>
            <input
              type='email'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
              placeholder='email@example.com'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300'>Role</label>
            <select
              className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value='student'>Student</option>
              <option value='faculty'>Faculty</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          {!user && (
            <div>
              <label className='mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300'>Password</label>
              <input
                type='password'
                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                placeholder='At least 6 characters'
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          )}

          <div className='flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors'
            >
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const UserManagement = memo(() => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      let userList = [];
      if (Array.isArray(response)) {
        userList = response;
      } else if (response && Array.isArray(response.data)) {
        userList = response.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        userList = response.data.data;
      } else if (response && response.users && Array.isArray(response.users)) {
        userList = response.users;
      }
      setUsers(userList);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError(err.response?.data?.message || err.message || 'Failed to load user records');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      const payload = { ...formData };
      if (selectedUser && !payload.password) {
        delete payload.password;
      }

      const targetId = selectedUser?._id || selectedUser?.id;
      if (selectedUser) {
        await api.put(`/users/${targetId}`, payload);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', payload);
        toast.success('User created successfully');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Failed to save user', err);
      const msg =
        err.response?.data?.message ||
        'Please check if the email already exists.';
      toast.error(`Failed to save user: ${msg}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
        toast.error('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='User Management'
        subtitle='Manage system users, roles, and access permissions'
        icon={Users}
        badge={`${users.length} Users`}
        actions={
          <div className='flex items-center gap-3'>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 transition-all disabled:opacity-50'
              title='Refresh list'
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleAddUser}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
            >
              <UserPlus size={16} />
              <span>Add New User</span>
            </button>
          </div>
        }
      />

      <div className='admin-table-container rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan='6'
                  style={{ textAlign: 'center', padding: '48px' }}
                >
                  <div className='flex flex-col items-center gap-2'>
                    <RefreshCw className='h-6 w-6 animate-spin text-indigo-600' />
                    <p className='text-slate-500 dark:text-slate-400'>Loading user database...</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan='6'
                  style={{ textAlign: 'center', padding: '48px' }}
                >
                  <div className='flex flex-col items-center gap-2 text-rose-500'>
                    <AlertCircle className='h-6 w-6' />
                    <p className='font-medium'>{error}</p>
                    <button
                      onClick={fetchUsers}
                      className='mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700'
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan='6'
                  style={{ textAlign: 'center', padding: '48px' }}
                >
                  <p className='text-slate-500 dark:text-slate-400'>
                    No users found in the system.
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id || user._id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{user.name}</div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        user.role === 'admin'
                          ? 'admin-badge-blue'
                          : user.role === 'faculty'
                            ? 'admin-badge-success'
                            : 'admin-badge-gray'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className='admin-badge admin-badge-success'>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td
                    style={{
                      color: 'var(--admin-text-muted)',
                      fontSize: '13px',
                    }}
                  >
                    {user.joined ||
                      (user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleEditUser(user)}
                      className='mr-4 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id || user._id)}
                      className='text-sm font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
});

UserManagement.displayName = 'UserManagement';

export default UserManagement;
