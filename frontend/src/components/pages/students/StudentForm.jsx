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
          toast.success(`Entry ${isEditing ? "synchronized" : "created"} successfully!`, { id: toastId });
          navigate("/students");
        } else {
          toast.error(res.message || "Failed to secure record", { id: toastId });
        }
      } catch (error) {
        toast.error("Network handshake failed", { id: toastId });
      }
    },
    [formData, id, isEditing, navigate],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-gray-400 font-bold tracking-widest text-sm">LOADING PROFILE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Premium Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-none p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <UserIcon size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Edit Academic Profile" : "Registry Enrollment"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                {isEditing ? "Updating existing student record details" : "Registering a new digital entity in the system"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/students")}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-sm"
          >
            <XIcon size={18} className="mr-2" /> Discard
          </button>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Section */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white font-bold"
                  placeholder="e.g. Alexander Pierce"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Roll Number */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Archive ID / Roll No</label>
                <div className="relative">
                  <HashIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white font-bold"
                    placeholder="e.g. 2024CS085"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contact Gateway</label>
                <div className="relative">
                  <PhoneIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white font-bold"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Digital Identity (Email)</label>
              <div className="relative">
                <MailIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white font-bold"
                  placeholder="student.id@university.edu"
                  required
                />
              </div>
            </div>

            {/* Dept & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                <div className="relative">
                  <DeptIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none text-gray-900 dark:text-white font-bold"
                    required
                  >
                    <option value="">Select Domain</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Milestone</label>
                <div className="relative">
                  <CalendarIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select 
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none text-gray-900 dark:text-white font-bold"
                    required
                  >
                    <option value="">Select Tenure</option>
                    <option value="1">Entry Year (1st)</option>
                    <option value="2">Core Period (2nd)</option>
                    <option value="3">Advanced Stage (3rd)</option>
                    <option value="4">Final Milestone (4th)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50 dark:border-slate-700">
              <button
                type="button"
                onClick={() => navigate("/students")}
                className="flex-1 px-8 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-2xl font-bold transition-all border border-gray-100 dark:border-slate-700 flex items-center justify-center"
              >
                <BackIcon size={18} className="mr-2" /> Return to Registry
              </button>
              <button
                type="submit"
                className="flex-[2] px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-2xl font-extrabold hover:shadow-2xl hover:shadow-indigo-300 dark:hover:shadow-none transition-all shadow-md flex items-center justify-center uppercase tracking-widest"
              >
                <SaveIcon size={20} className="mr-2" />
                {isEditing ? "Synchronize Profile" : "Finalize Enrollment"}
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
