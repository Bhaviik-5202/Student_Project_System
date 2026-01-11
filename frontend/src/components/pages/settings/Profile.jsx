import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    bio: "",
    avatar: null,
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+1 (555) 123-4567",
        department:
          user.department ||
          (user.role === "student" ? "Computer Science" : "Faculty"),
        year: user.year || (user.role === "student" ? "Final Year" : ""),
        bio:
          user.bio ||
          "Passionate about technology and education. Currently working on innovative projects and mentoring students.",
        avatar: user.avatar || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
        bio: formData.bio,
        avatar: formData.avatar,
      });

      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      alert("❌ Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+1 (555) 123-4567",
        department:
          user.department ||
          (user.role === "student" ? "Computer Science" : "Faculty"),
        year: user.year || (user.role === "student" ? "Final Year" : ""),
        bio:
          user.bio ||
          "Passionate about technology and education. Currently working on innovative projects and mentoring students.",
        avatar: user.avatar || null,
      });
    }
    setIsEditing(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!user) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner-simple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <p className="text-gray-600">
              Manage your personal information and account settings
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleNavigation("/settings")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 flex items-center"
            >
              <i className="fas fa-cog mr-2"></i> Settings
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center disabled:opacity-50"
            >
              <i
                className={`fas ${isEditing ? "fa-times" : "fa-edit"} mr-2`}
              ></i>
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto overflow-hidden border-4 border-white shadow-lg">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fas fa-user text-6xl text-primary-600"></i>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full cursor-pointer hover:bg-primary-700 shadow-lg transition duration-150">
                    <i className="fas fa-camera"></i>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
                {formData.avatar && isEditing && (
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, avatar: null }))
                    }
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 shadow-lg transition duration-150"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {formData.name}
              </h3>
              <p className="text-gray-600 mb-2">{formData.email}</p>
              <div className="flex items-center justify-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "faculty"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role === "admin" && "Administrator"}
                  {user.role === "faculty" && "Faculty Member"}
                  {user.role === "student" && "Student"}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {user.role === "student"
                        ? "2"
                        : user.role === "faculty"
                        ? "12"
                        : "48"}
                    </div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {user.role === "student"
                        ? "A-"
                        : user.role === "faculty"
                        ? "4.8"
                        : "100%"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.role === "student"
                        ? "GPA"
                        : user.role === "faculty"
                        ? "Rating"
                        : "Uptime"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">2023</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Last Login</span>
                    <span className="font-medium">Today, 10:30 AM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Account Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Verification</span>
                    <span className="font-medium text-green-600">Verified</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigation("/my-projects")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition duration-150 flex items-center"
                  >
                    <i className="fas fa-project-diagram mr-3 text-gray-500"></i>
                    My Projects
                  </button>
                  <button
                    onClick={() => handleNavigation("/meetings")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition duration-150 flex items-center"
                  >
                    <i className="fas fa-calendar-alt mr-3 text-gray-500"></i>
                    My Meetings
                  </button>
                  <button
                    onClick={() => handleNavigation("/reports")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition duration-150 flex items-center"
                  >
                    <i className="fas fa-chart-bar mr-3 text-gray-500"></i>
                    My Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-user-circle text-primary-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-sm text-gray-500">
                  Update your personal details and contact information
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-user mr-2 text-gray-400"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } ${loading ? "opacity-50" : ""}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-envelope mr-2 text-gray-400"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } ${loading ? "opacity-50" : ""}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-phone mr-2 text-gray-400"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } ${loading ? "opacity-50" : ""}`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-building mr-2 text-gray-400"></i>
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } ${loading ? "opacity-50" : ""}`}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">
                        Information Technology
                      </option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                  </div>
                </div>

                {user.role === "student" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-graduation-cap mr-2 text-gray-400"></i>
                      Academic Year
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } ${loading ? "opacity-50" : ""}`}
                    >
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="fas fa-file-alt mr-2 text-gray-400"></i>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing || loading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ${
                      isEditing
                        ? "border-gray-300"
                        : "border-gray-200 bg-gray-50"
                    } ${loading ? "opacity-50" : ""}`}
                    placeholder="Tell us about yourself, your interests, and your goals..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {isEditing && (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <div className="spinner-simple mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save mr-2"></i> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Additional Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-shield-alt text-red-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Account Security
                  </h4>
                  <p className="text-sm text-gray-500">
                    Manage your security settings
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/settings?tab=security")}
                    className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition duration-150"
                  >
                    Change
                  </button>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                  <div>
                    <p className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security
                    </p>
                  </div>
                  <span className="text-sm text-yellow-600 font-medium">
                    Not enabled
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                  <div>
                    <p className="font-medium text-gray-900">Login Activity</p>
                    <p className="text-sm text-gray-500">
                      Review recent sign-ins
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/settings?tab=activity")}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-150"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-bell text-blue-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Notification Preferences
                  </h4>
                  <p className="text-sm text-gray-500">
                    Control how we notify you
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: "email",
                    label: "Email Notifications",
                    description: "Receive updates via email",
                    defaultChecked: true,
                  },
                  {
                    id: "meeting",
                    label: "Meeting Reminders",
                    description: "Get reminded about meetings",
                    defaultChecked: true,
                  },
                  {
                    id: "project",
                    label: "Project Updates",
                    description: "Updates on project changes",
                    defaultChecked: true,
                  },
                  {
                    id: "announcement",
                    label: "Announcements",
                    description: "System announcements",
                    defaultChecked: false,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-link text-green-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Connected Accounts
                </h4>
                <p className="text-sm text-gray-500">
                  Manage your linked accounts
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Google",
                  email: user.email,
                  icon: "fab fa-google",
                  color: "red",
                },
                {
                  name: "Microsoft",
                  email: user.email,
                  icon: "fab fa-microsoft",
                  color: "blue",
                },
                {
                  name: "GitHub",
                  email: "Not connected",
                  icon: "fab fa-github",
                  color: "gray",
                },
                {
                  name: "LinkedIn",
                  email: "Not connected",
                  icon: "fab fa-linkedin",
                  color: "blue",
                },
              ].map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 bg-${account.color}-100 rounded-lg flex items-center justify-center mr-4`}
                    >
                      <i
                        className={`${account.icon} text-${account.color}-600`}
                      ></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {account.name}
                      </p>
                      <p className="text-sm text-gray-500">{account.email}</p>
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1 text-sm rounded-lg transition duration-150 ${
                      account.email === "Not connected"
                        ? "bg-primary-50 text-primary-600 hover:bg-primary-100"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {account.email === "Not connected" ? "Connect" : "Manage"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
