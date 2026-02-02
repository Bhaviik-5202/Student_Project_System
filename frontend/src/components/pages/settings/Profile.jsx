import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = memo(() => {
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

  const buildFormData = useCallback((currentUser) => {
    if (!currentUser) {
      return {
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        bio: "",
        avatar: null,
      };
    }

    return {
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "+1 (555) 123-4567",
      department:
        currentUser.department ||
        (currentUser.role === "student" ? "Computer Science" : "Faculty"),
      year:
        currentUser.year || (currentUser.role === "student" ? "Final Year" : ""),
      bio:
        currentUser.bio ||
        "Passionate about technology and education. Currently working on innovative projects and mentoring students.",
      avatar: currentUser.avatar || null,
    };
  }, []);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData(buildFormData(user));
    }
  }, [user, buildFormData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
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
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
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
    },
    [formData, updateProfile]
  );

  const handleCancel = useCallback(() => {
    if (user) {
      setFormData(buildFormData(user));
    }
    setIsEditing(false);
  }, [user, buildFormData]);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const roleBadgeClass = useMemo(
    () => ({
      admin: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
      faculty: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
      student: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    }),
    []
  );

  const roleLabel = useMemo(
    () => ({
      admin: "Administrator",
      faculty: "Faculty Member",
      student: "Student",
    }),
    []
  );

  const quickStats = useMemo(() => {
    if (user?.role === "faculty") {
      return {
        projects: "12",
        metric: "4.8",
        metricLabel: "Rating",
      };
    }

    if (user?.role === "admin") {
      return {
        projects: "48",
        metric: "100%",
        metricLabel: "Uptime",
      };
    }

    return {
      projects: "2",
      metric: "A-",
      metricLabel: "GPA",
    };
  }, [user?.role]);

  const notificationPreferences = useMemo(
    () => [
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
    ],
    []
  );

  const connectedAccounts = useMemo(
    () => [
      {
        name: "Google",
        email: user?.email || "Not connected",
        icon: "fab fa-google",
        badgeClass: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300",
      },
      {
        name: "Microsoft",
        email: user?.email || "Not connected",
        icon: "fab fa-microsoft",
        badgeClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
      },
      {
        name: "GitHub",
        email: "Not connected",
        icon: "fab fa-github",
        badgeClass: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
      },
      {
        name: "LinkedIn",
        email: "Not connected",
        icon: "fab fa-linkedin",
        badgeClass: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300",
      },
    ],
    [user?.email]
  );

  const inputBase =
    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150";
  const inputEnabled =
    "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100";
  const inputDisabled =
    "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400";

  if (!user) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner-simple mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Loading profile...
            </p>
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              My Profile
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Manage your personal information and account settings
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleNavigation("/settings")}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition duration-150 flex items-center"
            >
              <i className="fas fa-cog mr-2"></i> Settings
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 flex items-center disabled:opacity-50"
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full flex items-center justify-center mx-auto overflow-hidden border-4 border-white dark:border-slate-900 shadow-lg">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fas fa-user text-6xl text-blue-600"></i>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition duration-150">
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
                    className="absolute top-2 right-2 bg-rose-600 text-white p-2 rounded-full cursor-pointer hover:bg-rose-700 shadow-lg transition duration-150"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {formData.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                {formData.email}
              </p>
              <div className="flex items-center justify-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    roleBadgeClass[user.role]
                  }`}
                >
                  {roleLabel[user.role]}
                </span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full ml-2 animate-pulse"></div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {quickStats.projects}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {quickStats.metric}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {quickStats.metricLabel}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Member Since
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      2023
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Last Login
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Today, 10:30 AM
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Account Status
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Verification
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigation("/my-projects")}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition duration-150 flex items-center"
                  >
                    <i className="fas fa-project-diagram mr-3 text-slate-500 dark:text-slate-400"></i>
                    My Projects
                  </button>
                  <button
                    onClick={() => handleNavigation("/meetings")}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition duration-150 flex items-center"
                  >
                    <i className="fas fa-calendar-alt mr-3 text-slate-500 dark:text-slate-400"></i>
                    My Meetings
                  </button>
                  <button
                    onClick={() => handleNavigation("/reports")}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition duration-150 flex items-center"
                  >
                    <i className="fas fa-chart-bar mr-3 text-slate-500 dark:text-slate-400"></i>
                    My Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-user-circle text-blue-600 dark:text-blue-300"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Personal Information
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Update your personal details and contact information
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <i className="fas fa-user mr-2 text-slate-400"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`${inputBase} ${
                        isEditing ? inputEnabled : inputDisabled
                      } ${loading ? "opacity-50" : ""}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <i className="fas fa-envelope mr-2 text-slate-400"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`${inputBase} ${
                        isEditing ? inputEnabled : inputDisabled
                      } ${loading ? "opacity-50" : ""}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <i className="fas fa-phone mr-2 text-slate-400"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`${inputBase} ${
                        isEditing ? inputEnabled : inputDisabled
                      } ${loading ? "opacity-50" : ""}`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <i className="fas fa-building mr-2 text-slate-400"></i>
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`${inputBase} ${
                        isEditing ? inputEnabled : inputDisabled
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <i className="fas fa-graduation-cap mr-2 text-slate-400"></i>
                      Academic Year
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`${inputBase} ${
                        isEditing ? inputEnabled : inputDisabled
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <i className="fas fa-file-alt mr-2 text-slate-400"></i>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing || loading}
                    className={`${inputBase} ${
                      isEditing ? inputEnabled : inputDisabled
                    } ${loading ? "opacity-50" : ""}`}
                    placeholder="Tell us about yourself, your interests, and your goals..."
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {isEditing && (
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition duration-150 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 flex items-center disabled:opacity-50"
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
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/40 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-shield-alt text-rose-600 dark:text-rose-300"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Account Security
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage your security settings
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-150">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      Password
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/settings?tab=security")}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/40 transition duration-150"
                  >
                    Change
                  </button>
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-150">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add an extra layer of security
                    </p>
                  </div>
                  <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    Not enabled
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-150">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      Login Activity
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Review recent sign-ins
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/settings?tab=activity")}
                    className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition duration-150"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-bell text-blue-600 dark:text-blue-300"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Notification Preferences
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Control how we notify you
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {notificationPreferences.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-150"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {item.label}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-link text-emerald-600 dark:text-emerald-300"></i>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Connected Accounts
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage your linked accounts
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedAccounts.map((account) => (
                <div
                  key={account.name}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${account.badgeClass}`}>
                      <i className={account.icon}></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {account.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {account.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1 text-sm rounded-lg transition duration-150 ${
                      account.email === "Not connected"
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/40"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
});

Profile.displayName = 'Profile';

export default Profile;
