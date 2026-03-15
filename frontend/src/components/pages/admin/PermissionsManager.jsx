import { useState, useCallback, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const PermissionsManager = memo(() => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/admin/roles");
        setRoles(response.data || []);
      } catch (error) {
        console.error("Failed to fetch roles", error);
        // Fallback or empty state could be managed here
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const [permissions, setPermissions] = useState({
    userManagement: { admin: true, faculty: false, student: false },
    projectManagement: { admin: true, faculty: true, student: true },
    courseManagement: { admin: true, faculty: true, student: false },
    systemSettings: { admin: true, faculty: false, student: false },
    reporting: { admin: true, faculty: true, student: false },
    backupRestore: { admin: true, faculty: false, student: false },
  });

  const [selectedRole, setSelectedRole] = useState("admin");

  const togglePermission = useCallback((permission, role) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [role]: !prev[permission][role],
      },
    }));
  }, []);

  const savePermissions = useCallback(() => {
    toast.success("Permissions updated successfully");
  }, []);

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
      ["userManagement", "systemSettings", "backupRestore"].forEach((key) => {
        updated[key] = { ...updated[key], [selectedRole]: false };
      });
      ["projectManagement", "courseManagement", "reporting"].forEach((key) => {
        updated[key] = { ...updated[key], [selectedRole]: true };
      });
      return updated;
    });
  }, [selectedRole]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Permissions Manager
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage user roles and permissions
            </p>
          </div>
          <button
            onClick={savePermissions}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Roles
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center text-slate-500 py-4">Loading roles...</div>
                ) : roles.length === 0 ? (
                  <div className="text-center text-slate-500 py-4">No roles defined.</div>
                ) : (
                  roles.map((role) => (
                    <button
                      key={role.id || role._id}
                      onClick={() => setSelectedRole(role.name.toLowerCase())}
                      className={`w-full p-4 text-left rounded-lg transition-colors ${
                        selectedRole === role.name.toLowerCase()
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 border"
                          : "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="font-medium text-slate-900 dark:text-white">
                        {role.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {role.description}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {role.users || 0} users
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white capitalize mb-2">
                  {selectedRole} Permissions
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {
                    roles.find((r) => r.name.toLowerCase() === selectedRole)
                      ?.description
                  }
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Permission
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Allow
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {Object.entries({
                      userManagement: "Manage users and access rights",
                      projectManagement: "Create, edit, and manage projects",
                      courseManagement: "Manage courses and materials",
                      systemSettings: "Configure system settings",
                      reporting: "Access and generate reports",
                      backupRestore: "Perform backup and restore operations",
                    }).map(([key, description]) => (
                      <tr
                        key={key}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-600 dark:text-slate-400">
                            {description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => togglePermission(key, selectedRole)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              permissions[key][selectedRole]
                                ? "bg-emerald-600 dark:bg-emerald-500"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                permissions[key][selectedRole]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Quick Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={allowAll}
                    className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                  >
                    Allow All
                  </button>
                  <button
                    onClick={denyAll}
                    className="px-3 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50"
                  >
                    Deny All
                  </button>
                  <button
                    onClick={setAsFaculty}
                    className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
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

PermissionsManager.displayName = "PermissionsManager";

export default PermissionsManager;
