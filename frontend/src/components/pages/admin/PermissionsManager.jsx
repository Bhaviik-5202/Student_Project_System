import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const PermissionsManager = () => {
  const navigate = useNavigate();
  const [roles] = useState([
    { id: 1, name: "Admin", users: 3, description: "Full system access" },
    {
      id: 2,
      name: "Faculty",
      users: 12,
      description: "Manage courses and projects",
    },
    {
      id: 3,
      name: "Student",
      users: 141,
      description: "Access to courses and projects",
    },
  ]);

  const [permissions, setPermissions] = useState({
    userManagement: { admin: true, faculty: false, student: false },
    projectManagement: { admin: true, faculty: true, student: true },
    courseManagement: { admin: true, faculty: true, student: false },
    systemSettings: { admin: true, faculty: false, student: false },
    reporting: { admin: true, faculty: true, student: false },
    backupRestore: { admin: true, faculty: false, student: false },
  });

  const [selectedRole, setSelectedRole] = useState("admin");

  const togglePermission = (permission, role) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [role]: !prev[permission][role],
      },
    }));
  };

  const savePermissions = () => {
    toast.success("Permissions updated successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Permissions Manager
            </h1>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>
          <button
            onClick={savePermissions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Roles
              </h3>
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.name.toLowerCase())}
                    className={`w-full p-4 text-left rounded-lg transition-colors ${
                      selectedRole === role.name.toLowerCase()
                        ? "bg-blue-50 border-blue-200 border"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{role.name}</div>
                    <div className="text-sm text-gray-600">
                      {role.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {role.users} users
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">
                  {selectedRole} Permissions
                </h3>
                <p className="text-gray-600">
                  {
                    roles.find((r) => r.name.toLowerCase() === selectedRole)
                      ?.description
                  }
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Permission
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Allow
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries({
                      userManagement: "Manage users and access rights",
                      projectManagement: "Create, edit, and manage projects",
                      courseManagement: "Manage courses and materials",
                      systemSettings: "Configure system settings",
                      reporting: "Access and generate reports",
                      backupRestore: "Perform backup and restore operations",
                    }).map(([key, description]) => (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">{description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => togglePermission(key, selectedRole)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              permissions[key][selectedRole]
                                ? "bg-green-600"
                                : "bg-gray-200"
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
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Quick Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      Object.keys(permissions).forEach((key) => {
                        permissions[key][selectedRole] = true;
                      });
                      setPermissions({ ...permissions });
                    }}
                    className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200"
                  >
                    Allow All
                  </button>
                  <button
                    onClick={() => {
                      Object.keys(permissions).forEach((key) => {
                        permissions[key][selectedRole] = false;
                      });
                      setPermissions({ ...permissions });
                    }}
                    className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                  >
                    Deny All
                  </button>
                  <button
                    onClick={() => {
                      [
                        "userManagement",
                        "systemSettings",
                        "backupRestore",
                      ].forEach((key) => {
                        permissions[key][selectedRole] = false;
                      });
                      [
                        "projectManagement",
                        "courseManagement",
                        "reporting",
                      ].forEach((key) => {
                        permissions[key][selectedRole] = true;
                      });
                      setPermissions({ ...permissions });
                    }}
                    className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200"
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
};

export default PermissionsManager;
