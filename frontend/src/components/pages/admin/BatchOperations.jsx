import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const BatchOperations = memo(() => {
  const navigate = useNavigate();
  const [operation, setOperation] = useState("email");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(
          (response.data?.data || []).map((u) => ({
            ...u,
            id: u._id || u.id,
            selected: false,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch users", error);
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
        : [...prev, userId],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedUsers((prev) =>
      prev.length === users.length ? [] : users.map((user) => user.id),
    );
  }, [users]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedUsers.length === 0) {
        toast.error("Please select at least one user");
        return;
      }

      setLoading(true);

      setTimeout(() => {
        toast.success(
          `${operation} operation completed for ${selectedUsers.length} users`,
        );
        setLoading(false);
        setMessage("");
        setSelectedUsers([]);
      }, 2000);
    },
    [operation, selectedUsers],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Batch Operations
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Perform operations on multiple users at once
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operation Settings */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Operation Settings
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Operation Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "email", label: "Send Email", icon: "📧" },
                    {
                      id: "notification",
                      label: "Send Notification",
                      icon: "🔔",
                    },
                    { id: "export", label: "Export Data", icon: "📤" },
                  ].map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setOperation(op.id)}
                      className={`px-4 py-3 rounded-lg border text-center transition-colors ${
                        operation === op.id
                          ? "border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="text-xl mb-2">{op.icon}</div>
                      <div className="font-medium">{op.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {operation === "email"
                    ? "Email Message"
                    : operation === "notification"
                      ? "Notification Message"
                      : "Export Settings"}
                </label>
                {operation === "export" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Format
                      </label>
                      <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600">
                        <option>CSV</option>
                        <option>Excel</option>
                        <option>PDF</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Include Data
                      </label>
                      <div className="space-y-2">
                        {[
                          "User Information",
                          "Project Data",
                          "Grades",
                          "Activity Logs",
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                            />
                            <span className="ml-2 text-slate-700 dark:text-slate-300">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <textarea
                    rows="6"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Enter your ${
                      operation === "email" ? "email" : "notification"
                    } message here...`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* User Selection */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Select Users
                </h3>
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {selectedUsers.length === users.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {usersLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No users found.</div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {user.name || (user.firstName + " " + user.lastName)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {user.role}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Selected: {selectedUsers.length} users
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || selectedUsers.length === 0}
                  className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Execute ${
                      operation === "email"
                        ? "Email"
                        : operation === "notification"
                          ? "Notification"
                          : "Export"
                    } Operation`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BatchOperations.displayName = "BatchOperations";

export default BatchOperations;
