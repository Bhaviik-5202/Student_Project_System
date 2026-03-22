import { useState, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

const PermissionsManager = memo(() => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/admin/roles');
        setRoles(response.data || []);
      } catch (error) {
        console.error('Failed to fetch roles', error);
        // Fallback or empty state could be managed here
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const [permissions, setPermissions] = useState({});
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState('Admin');

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!selectedRole) return;
      try {
        setPermissionsLoading(true);
        const response = await api.get(`/admin/permissions/${selectedRole}`);
        setPermissions(response.data || {});
      } catch (error) {
        console.error('Failed to fetch permissions', error);
      } finally {
        setPermissionsLoading(false);
      }
    };
    fetchPermissions();
  }, [selectedRole]);

  const togglePermission = useCallback(
    async (permission, role) => {
      const newValue = !permissions[permission];
      setPermissions((prev) => ({
        ...prev,
        [permission]: newValue,
      }));
    },
    [permissions]
  );

  const savePermissions = useCallback(async () => {
    try {
      await api.put(`/admin/permissions/${selectedRole}`, permissions);
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Failed to update permissions', error);
      toast.error('Failed to update permissions');
    }
  }, [selectedRole, permissions]);

  const allowAll = useCallback(() => {
    setPermissions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = { ...updated[key], [selectedRole]: true };
      });
      return updated;
    });
  }, [selectedRole]);

  const denyAll = useCallback(() => {
    setPermissions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = { ...updated[key], [selectedRole]: false };
      });
      return updated;
    });
  }, [selectedRole]);

  const setAsFaculty = useCallback(() => {
    setPermissions((prev) => {
      const updated = { ...prev };
      ['userManagement', 'systemSettings', 'backupRestore'].forEach((key) => {
        updated[key] = { ...updated[key], [selectedRole]: false };
      });
      ['projectManagement', 'courseManagement', 'reporting'].forEach((key) => {
        updated[key] = { ...updated[key], [selectedRole]: true };
      });
      return updated;
    });
  }, [selectedRole]);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Permissions Manager
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              Manage user roles and permissions
            </p>
          </div>
          <button
            onClick={savePermissions}
            className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
          >
            Save Changes
          </button>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Roles List */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Roles
              </h3>
              <div className='space-y-3'>
                {loading ? (
                  <div className='py-4 text-center text-slate-500'>
                    Loading roles...
                  </div>
                ) : roles.length === 0 ? (
                  <div className='py-4 text-center text-slate-500'>
                    No roles defined.
                  </div>
                ) : (
                  roles.map((role) => (
                    <button
                      key={role.id || role._id}
                      onClick={() => setSelectedRole(role.name.toLowerCase())}
                      className={`w-full rounded-lg p-4 text-left transition-colors ${
                        selectedRole === role.name.toLowerCase()
                          ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                          : 'border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {role.name}
                      </div>
                      <div className='text-sm text-slate-600 dark:text-slate-400'>
                        {role.description}
                      </div>
                      <div className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                        {role.users || 0} users
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Permissions Table */}
          <div className='lg:col-span-3'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <div className='mb-6'>
                <h3 className='mb-2 text-lg font-semibold capitalize text-slate-900 dark:text-white'>
                  {selectedRole} Permissions
                </h3>
                <p className='text-slate-600 dark:text-slate-400'>
                  {
                    roles.find((r) => r.name.toLowerCase() === selectedRole)
                      ?.description
                  }
                </p>
              </div>

              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead>
                    <tr className='border-b border-slate-200 dark:border-slate-700'>
                      <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                        Permission
                      </th>
                      <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                        Description
                      </th>
                      <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                        Allow
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                    {permissionsLoading ? (
                      <tr>
                        <td
                          colSpan='3'
                          className='px-6 py-4 text-center text-slate-500'
                        >
                          Loading permissions...
                        </td>
                      </tr>
                    ) : (
                      Object.entries({
                        userManagement: 'Manage users and access rights',
                        projectManagement: 'Create, edit, and manage projects',
                        courseManagement: 'Manage courses and materials',
                        systemSettings: 'Configure system settings',
                        reporting: 'Access and generate reports',
                        backupRestore: 'Perform backup and restore operations',
                      }).map(([key, description]) => (
                        <tr
                          key={key}
                          className='hover:bg-slate-50 dark:hover:bg-slate-700'
                        >
                          <td className='whitespace-nowrap px-6 py-4'>
                            <div className='font-medium text-slate-900 dark:text-white'>
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='text-slate-600 dark:text-slate-400'>
                              {description}
                            </div>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <button
                              onClick={() =>
                                togglePermission(key, selectedRole)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                permissions[key]
                                  ? 'bg-emerald-600 dark:bg-emerald-500'
                                  : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  permissions[key]
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Quick Actions */}
              <div className='mt-8 border-t border-slate-200 pt-6 dark:border-slate-700'>
                <h4 className='mb-3 text-sm font-medium text-slate-900 dark:text-white'>
                  Quick Actions
                </h4>
                <div className='flex flex-wrap gap-2'>
                  <button
                    onClick={allowAll}
                    className='rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                  >
                    Allow All
                  </button>
                  <button
                    onClick={denyAll}
                    className='rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50'
                  >
                    Deny All
                  </button>
                  <button
                    onClick={setAsFaculty}
                    className='rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                  >
                    Set as Faculty
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PermissionsManager.displayName = 'PermissionsManager';

export default PermissionsManager;
