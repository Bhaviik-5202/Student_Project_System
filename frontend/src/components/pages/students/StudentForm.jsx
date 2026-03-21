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
    year: "",
    phone: "",
  });
  
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
              department: res.data.department || "",
              year: res.data.year || "",
              phone: res.data.phone || "",
            });
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
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    },
    [formData],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const toastId = toast.loading(isEditing ? "Updating record..." : "Creating record...");
      
      try {
        const res = isEditing 
          ? await studentService.updateStudent(id, formData)
          : await studentService.createStudent(formData);
          
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
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <UserIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Update Student Profile" : "Registry Enrollment"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isEditing ? "Modify existing academic record" : "Enroll a new student in the registry"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/students")}
            className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-colors"
            title="Discard changes"
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                placeholder="Student Name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Roll Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Roll Number</label>
              <div className="relative">
                <HashIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                  placeholder="e.g. 2024CS01"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
              <div className="relative">
                <PhoneIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                  placeholder="Contact Number"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <MailIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                placeholder="example@university.com"
                required
              />
            </div>
          </div>

          {/* Dept & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Department</label>
              <div className="relative">
                <DeptIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none text-sm font-medium"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Academic Year</label>
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none text-sm font-medium"
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
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-all flex items-center justify-center text-sm"
            >
              <SaveIcon size={16} className="mr-2" />
              {isEditing ? "Update Student" : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

StudentForm.displayName = "StudentForm";
export default StudentForm;
