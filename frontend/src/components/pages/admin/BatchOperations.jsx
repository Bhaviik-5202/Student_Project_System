import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BatchOperations = () => {
  const navigate = useNavigate();
  const [operation, setOperation] = useState("email");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      selected: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Faculty",
      selected: false,
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "Student",
      selected: false,
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Student",
      selected: false,
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com",
      role: "Faculty",
      selected: false,
    },
  ];

  const toggleUserSelection = (userId) => {
    setSelectedUsers(
      selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : [...selectedUsers, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success(
        `${operation} operation completed for ${selectedUsers.length} users`
      );
      setLoading(false);
      setMessage("");
      setSelectedUsers([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Batch Operations</h1>
          <p className="text-gray-600">
            Perform operations on multiple users at once
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operation Settings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Operation Settings
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-xl mb-2">{op.icon}</div>
                      <div className="font-medium">{op.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {operation === "email"
                    ? "Email Message"
                    : operation === "notification"
                    ? "Notification Message"
                    : "Export Settings"}
                </label>
                {operation === "export" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>CSV</option>
                        <option>Excel</option>
                        <option>PDF</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <textarea
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Users
                </h3>
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {selectedUsers.length === users.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-4">
                  Selected: {selectedUsers.length} users
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || selectedUsers.length === 0}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
};

export default BatchOperations;
