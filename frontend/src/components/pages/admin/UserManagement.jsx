import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Users, UserPlus, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';
import {
  notifyDataChanged,
  subscribeDataChanged,
} from '../../../utils/eventBus';
import '../../../assets/styles/admin.css';

const SUPER_ADMIN_EMAIL = 'er.bhavik5202@gmail.com';

const UserManagement = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
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
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        userList = response.data.data;
      } else if (response && response.users && Array.isArray(response.users)) {
        userList = response.users;
      }
      setUsers(userList);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load user records'
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-refresh when any user CRUD event fires from anywhere in the app
  useEffect(() => {
    const unsubscribe = subscribeDataChanged((detail) => {
      if (detail?.type === 'user_changed' || detail?.type === 'staff_changed') {
        fetchUsers();
      }
    });
    return () => unsubscribe();
  }, [fetchUsers]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchUsers();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, fetchUsers, navigate, location.pathname]);

  const handleAddUser = () => {
    navigate('/user-management/new');
  };

  const isSuperAdminUser = (user) => {
    if (!user) return false;
    return (
      user.role === 'admin' ||
      (user.email && user.email.toLowerCase().trim() === SUPER_ADMIN_EMAIL)
    );
  };

  const handleEditUser = (user) => {
    if (isSuperAdminUser(user)) {
      toast.error('Super Admin account is protected and cannot be modified.');
      return;
    }
    const userId = user.id || user._id;
    navigate(`/user-management/${userId}/edit`);
  };

  const handleDeleteUser = async (userId) => {
    const targetUser = users.find((u) => (u.id || u._id) === userId);
    if (isSuperAdminUser(targetUser)) {
      toast.error('Super Admin account is protected and cannot be modified.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('User deleted successfully');
        notifyDataChanged({
          type: 'user_changed',
          action: 'deleted',
          id: userId,
        });
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
        toast.error(
          err.response?.data?.message || 'Failed to delete user. Please try again.'
        );
      }
    }
  };

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
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
              className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50'
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

      <div className='admin-table-container rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700'>
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
                    <p className='text-slate-500 dark:text-slate-400'>
                      Loading user database...
                    </p>
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
              users.map((user) => {
                const isSuperAdmin = isSuperAdminUser(user);
                return (
                  <tr key={user.id || user._id}>
                    <td>
                      <div className='flex items-center gap-2 font-semibold text-slate-900 dark:text-white'>
                        <span>{user.name}</span>
                        {isSuperAdmin && (
                          <span
                            className='inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50'
                            title='Protected Super Admin'
                          >
                            <Shield size={10} className='mr-1' />
                            Super Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='text-slate-700 dark:text-slate-300'>
                      {user.email}
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${
                          isSuperAdmin
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
                    <td className='text-xs text-slate-500 dark:text-slate-400'>
                      {user.joined ||
                        (user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'N/A')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isSuperAdmin ? (
                        <span
                          className='inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 select-none bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/40'
                          title='Super Admin account is protected and cannot be modified'
                        >
                          <Shield size={12} />
                          Protected
                        </span>
                      ) : (
                        <>
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
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

UserManagement.displayName = 'UserManagement';

export default UserManagement;
