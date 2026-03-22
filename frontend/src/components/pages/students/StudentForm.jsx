import React, { useState, memo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User as UserIcon,
  Mail as MailIcon,
  Hash as HashIcon,
  Phone as PhoneIcon,
  Building as DeptIcon,
  Calendar as CalendarIcon,
  X as XIcon,
  Save as SaveIcon,
  ArrowLeft as BackIcon
} from "lucide-react";
import studentService from "../../../services/studentService";

const StudentForm = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    customDepartment: "",
    year: "",
    phone: "",
  });
  const [showCustomDept, setShowCustomDept] = useState(false);

  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchStudent = async () => {
        try {
          const res = await studentService.getStudentById(id);
          if (res.success && res.data) {
            setFormData({
              name: res.data.name || "",
              email: res.data.email || "",
              rollNumber: res.data.rollNumber || "",
              department: ["Computer Science", "Information Technology", "Electronics"].includes(res.data.department)
                ? res.data.department
                : "Other",
              customDepartment: !["Computer Science", "Information Technology", "Electronics"].includes(res.data.department)
                ? res.data.department
                : "",
              year: res.data.year || "",
              phone: res.data.phone || "",
            });
            setShowCustomDept(!["Computer Science", "Information Technology", "Electronics"].includes(res.data.department));
          } else {
            toast.error("Failed to fetch student details");
            navigate("/students");
          }
        } catch (error) {
          toast.error("Error fetching student details");
          navigate("/students");
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditing, navigate]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "department") {
        setShowCustomDept(value === "Other");
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [formData],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const toastId = toast.loading(isEditing ? "Updating record..." : "Creating record...");

      try {
        const payload = {
          ...formData,
          department: showCustomDept ? formData.customDepartment : formData.department
        };
        // Remove helper fields from payload
        delete payload.customDepartment;

        const res = isEditing
          ? await studentService.updateStudent(id, payload)
          : await studentService.createStudent(payload);

        if (res.success) {
          toast.success(`Student ${isEditing ? "updated" : "enrolled"} successfully!`, { id: toastId });
          navigate("/students");
        } else {
          toast.error(res.message || "Failed to save record", { id: toastId });
        }
      } catch (error) {
        toast.error("Network error occurred", { id: toastId });
      }
    },
    [formData, id, isEditing, navigate],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading student form...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in mb-20">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
                <i className={`fas fa-${isEditing ? 'user-edit' : 'user-plus'} text-2xl text-white`}></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                  {isEditing ? "Update Student Profile" : "Enrollment Registry"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {isEditing ? `Modifying record for ${formData.name}` : "Create a new student entry in the directory"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/students")}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              title="Discard changes"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Full Name</label>
                <div className="registry-input-group">
                  <UserIcon size={18} className="registry-icon" />
                  <div className="registry-divider" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="registry-control"
                    placeholder="Full Name (e.g. John Doe)"
                    required
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Roll Number</label>
                <div className="registry-input-group">
                  <HashIcon size={18} className="registry-icon" />
                  <div className="registry-divider" />
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="registry-control"
                    placeholder="Roll Number (e.g. 2024CS01)"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Phone Number</label>
                <div className="registry-input-group">
                  <PhoneIcon size={18} className="registry-icon" />
                  <div className="registry-divider" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="registry-control"
                    placeholder="Phone (e.g. +91 98765 43210)"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Email Address</label>
                <div className="registry-input-group">
                  <MailIcon size={18} className="registry-icon" />
                  <div className="registry-divider" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="registry-control"
                    placeholder="Email (e.g. student@university.edu)"
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Department</label>
                <div className="registry-input-group">
                  <DeptIcon size={18} className="registry-icon" />
                  <div className="registry-divider" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="registry-control appearance-none"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other (Specify...)</option>
                  </select>
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Academic Year</label>
                <div className="registry-input-group">
                  <CalendarIcon size={18} className="registry-icon" />
                  <div className="registry-divider" />
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="registry-control appearance-none"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">Final Year</option>
                  </select>
                </div>
              </div>

              {showCustomDept && (
                <div className="md:col-span-2 animate-fade-in">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Specify Department</label>
                  <div className="registry-input-group">
                    <DeptIcon size={18} className="registry-icon" />
                    <div className="registry-divider" />
                    <input
                      type="text"
                      name="customDepartment"
                      value={formData.customDepartment}
                      onChange={handleChange}
                      className="registry-control"
                      placeholder="Enter department name"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate("/students")}
                className="flex-1 h-12 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <BackIcon size={16} />
                Back to List
              </button>
              <button
                type="submit"
                className="flex-[2] h-12 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <SaveIcon size={18} />
                {isEditing ? "Update Student Profile" : "Complete Enrollment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

StudentForm.displayName = "StudentForm";
export default StudentForm;
