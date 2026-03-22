import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className='admin-modal-overlay'>
      <div
        className='admin-modal shadow-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='admin-modal-header'>
          <h3 className='text-lg font-bold'>
            {user ? 'Edit User' : 'Add New User'}
          </h3>
          <button
            onClick={onClose}
            className='text-2xl text-slate-400 hover:text-slate-600'
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='admin-modal-body'>
            <div className='admin-form-group'>
              <label className='admin-label'>Full Name</label>
              <input
                type='text'
                className='admin-input'
                placeholder='John Doe'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className='admin-form-group'>
              <label className='admin-label'>Email Address</label>
              <input
                type='email'
                className='admin-input'
                placeholder='email@example.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className='admin-form-group'>
              <label className='admin-label'>Role</label>
              <select
                className='admin-input'
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value='student'>Student</option>
                <option value='faculty'>Faculty</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
            {!user && (
              <div className='admin-form-group'>
                <label className='admin-label'>Password</label>
                <input
                  type='password'
                  className='admin-input'
                  placeholder='At least 6 characters'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            )}
          </div>
          <div className='admin-modal-footer'>
            <button
              type='button'
              onClick={onClose}
              className='admin-btn admin-btn-secondary'
            >
              Cancel
            </button>
            <button type='submit' className='admin-btn admin-btn-primary'>
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      // Don't send empty password during update
      if (selectedUser && !payload.password) {
        delete payload.password;
      }

      if (selectedUser) {
        await api.put(`/users/${selectedUser.id || selectedUser._id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user', error);
      const msg =
        error.response?.data?.message ||
        'Please check if the email already exists.';
      alert(`Failed to save user: ${msg}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        // Refresh the list
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className='admin-page'>
      <div className='admin-container'>
        <header className='admin-header'>
          <div className='flex flex-col'>
            <h1 className='admin-title'>User Management</h1>
            <p className='admin-subtitle'>
              Manage system users, roles, and access permissions
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className='admin-btn admin-btn-primary'
          >
            Add New User
          </button>
        </header>

        <div className='admin-table-container'>
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
                      <p className='text-slate-500'>Loading user database...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan='6'
                    style={{ textAlign: 'center', padding: '48px' }}
                  >
                    <p className='text-slate-500'>
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
                        className='mr-4 text-sm font-semibold text-blue-600 hover:text-blue-800'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id || user._id)}
                        className='text-sm font-semibold text-rose-600 hover:text-rose-800'
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
