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

const MobileUserCard = memo(({ user, isSuperAdmin, onEdit, onDelete }) => (
  <div className='flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
    <div className='flex items-start justify-between gap-3'>
      <div className='flex items-center gap-3'>
        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-lg font-black text-indigo-600 dark:from-indigo-950/60 dark:to-indigo-900/40 dark:text-indigo-400'>
          {user.name ? user.name.charAt(0).toUpperCase() : <Users size={20} />}
        </div>
        <div className='flex flex-col'>
          <div className='flex items-center gap-2 text-[15px] font-black text-slate-900 dark:text-white leading-tight'>
            {user.name}
            {isSuperAdmin && (
              <span
                className='inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50'
                title='Protected Super Admin'
              >
                <Shield size={10} className='mr-1' />
                SA
              </span>
            )}
          </div>
          <div className='text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate'>
            {user.email}
          </div>
        </div>
      </div>
      <span className='inline-flex shrink-0 items-center rounded-xl bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'>
        {user.status || 'Active'}
      </span>
    </div>

    <div className='mt-2 flex items-center justify-between rounded-xl bg-slate-50/50 p-3 dark:bg-slate-800/40'>
      <div className='flex items-center gap-2'>
        <span
          className={`admin-badge ${isSuperAdmin ? 'admin-badge-blue' : user.role === 'faculty' ? 'admin-badge-success' : 'admin-badge-gray'}`}
        >
          {user.role}
        </span>
        <span className='text-[10px] font-semibold text-slate-400'>
          Joined{' '}
          {user.joined ||
            (user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'N/A')}
        </span>
      </div>

      <div className='flex items-center gap-2'>
        {isSuperAdmin ? (
          <span className='inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-400 select-none'>
            <Shield size={10} />
            Protected
          </span>
        ) : (
          <>
            <button
              onClick={() => onEdit(user)}
              className='flex h-8 px-3 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-transform active:scale-90 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-xs'
            >
              <span className='font-bold text-[11px]'>Edit</span>
            </button>
            <button
              onClick={() => onDelete(user.id || user._id)}
              className='flex h-8 px-3 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-transform active:scale-90 dark:bg-rose-500/20 dark:text-rose-400 shadow-xs'
            >
              <span className='font-bold text-[11px]'>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  </div>
));

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
          err.response?.data?.message ||
            'Failed to delete user. Please try again.'
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

      <div className='hidden md:block admin-table-container rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700'>
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
                            onClick={() =>
                              handleDeleteUser(user.id || user._id)
                            }
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

      {/* Mobile Card Layout */}
      <div className='block md:hidden space-y-4'>
        {loading ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <RefreshCw className='mb-3 h-6 w-6 animate-spin text-indigo-600' />
            <span className='text-[13px] font-semibold text-slate-500'>
              Loading users...
            </span>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <AlertCircle className='mb-3 h-6 w-6 text-rose-500' />
            <span className='text-[13px] font-semibold text-rose-500 mb-2'>
              {error}
            </span>
            <button
              onClick={fetchUsers}
              className='rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700'
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <Users className='mb-3 h-10 w-10 text-slate-300 dark:text-slate-600' />
            <span className='text-[13px] font-semibold text-slate-500'>
              No users found.
            </span>
          </div>
        ) : (
          users.map((user) => (
            <MobileUserCard
              key={user.id || user._id}
              user={user}
              isSuperAdmin={isSuperAdminUser(user)}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          ))
        )}
      </div>
    </div>
  );
});

UserManagement.displayName = 'UserManagement';

export default UserManagement;
