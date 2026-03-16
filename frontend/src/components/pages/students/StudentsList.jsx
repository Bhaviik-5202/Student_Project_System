import React, { memo, useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { 
  User as UserIcon, 
  UserPlus as UserPlusIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon,
  GraduationCap as GradIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Edit2 as EditIcon, 
  Trash2 as TrashIcon,
  MoreVertical as MoreIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Users as UsersIcon,
  Hash as HashIcon,
  Calendar as CalendarIcon,
  RotateCcw as ResetIcon,
  Building as DeptIcon,
  Activity as ActivityIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import studentService from "../../../services/studentService";

// --- Custom Hooks (From Dashboard for consistency) ---
const useAnimatedCounter = (endValue, duration = 1000) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(endValue) || 0;

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  return count;
};

const PremiumStatCard = ({ label, value, icon: Icon, color, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const animatedValue = useAnimatedCounter(isVisible ? value : 0, 1200);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const colorStyles = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-none",
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200 dark:shadow-none",
    purple: "from-purple-500 to-purple-600 shadow-purple-200 dark:shadow-none",
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 bg-gradient-to-br ${colorStyles[color]} rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
            {animatedValue}
          </p>
        </div>
      </div>
    </div>
  );
};

const StudentRow = memo(({ student, onEdit, onDelete }) => (
  <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-all duration-300">
    <td className="px-6 py-5 whitespace-nowrap">
      <div className="text-[10px] font-black font-mono text-gray-300 dark:text-gray-600 uppercase tracking-widest bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md inline-block">
        #{(student.id || "").toString().slice(-6).toUpperCase()}
      </div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-white dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
          <UserIcon size={20} />
        </div>
        <div className="ml-4">
          <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {student.name}
          </div>
          <div className="flex items-center text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
            <MailIcon size={10} className="mr-1.5 opacity-60" />
            {student.email}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap">
      <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-white dark:border-slate-700 shadow-sm">
        <DeptIcon size={12} className="mr-2 text-indigo-400" />
        {student.department}
      </div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap">
      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
        Milestone {student.year}
      </span>
    </td>
    <td className="px-6 py-5 whitespace-nowrap">
      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
        student.status === "Active" 
          ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
          : "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400"
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${student.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
        {student.status || "Active"}
      </span>
    </td>
    <td className="px-6 py-5 whitespace-nowrap text-right">
      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <button 
          onClick={() => onEdit(student.id)}
          className="p-2.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-xl transition-all shadow-sm border border-transparent hover:border-indigo-100"
          title="Modify Profile"
        >
          <EditIcon size={16} />
        </button>
        <button 
          onClick={() => onDelete(student.id)}
          className="p-2.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100"
          title="Purge Record"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </td>
  </tr>
));

const StudentsList = memo(() => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.name || "";
      const email = student.email || "";
      const id = student.id || "";
      
      const matchesSearch = search === "" || 
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        id.toLowerCase().includes(search.toLowerCase());
        
      const matchesDepartment = department === "" || student.department === department;
      const matchesYear = year === "" || student.year === year;
      return matchesSearch && matchesDepartment && matchesYear;
    });
  }, [students, search, department, year]);

  const stats = useMemo(() => {
    return {
      total: students.length,
      departments: new Set(students.map(s => s.department)).size,
      active: students.filter(s => s.status === "Active").length,
    };
  }, [students]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await studentService.getAllStudents();
        if (res.success) {
          setStudents(
            (res.data || []).map((student) => ({
              id: student._id || student.id,
              name: student.name,
              rollNumber: student.rollNumber,
              department: student.department,
              year: student.year,
              email: student.email,
              phone: student.phone || "N/A",
              status: student.status || "Active",
            }))
          );
        } else {
          setError(res.message || "Failed to load students");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleEdit = useCallback((id) => {
    navigate(`/students/${id}/edit`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this student record?")) return;
    
    const toastId = toast.loading("Deleting record...");
    const res = await studentService.deleteStudent(id);
    
    if (res.success) {
      setStudents(students.filter(s => s.id !== id));
      toast.success("Student record erased successfully", { id: toastId });
    } else {
      toast.error(res.message || "Failed to delete student", { id: toastId });
    }
  }, [students]);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Premium Header Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-none p-6 md:p-8 lg:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 dark:shadow-none transform hover:rotate-3 transition-transform duration-300">
              <UsersIcon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Student Enrollment Center</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-widest text-[11px]">Academic Registry & Entity Management</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/students/new")} 
            className="group relative bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-8 py-4 rounded-2xl font-black transition-all hover:shadow-2xl hover:shadow-indigo-300 dark:hover:shadow-none flex items-center shadow-lg uppercase tracking-widest text-xs"
          >
            <UserPlusIcon size={18} className="mr-3 transform group-hover:scale-125 transition-transform" />
            Registry Enrollment
          </button>
        </div>
      </div>

      {/* Premium Animated Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PremiumStatCard label="Total Entities" value={stats.total} icon={UsersIcon} color="blue" index={0} />
        <PremiumStatCard label="Active Domains" value={stats.departments} icon={DeptIcon} color="indigo" index={1} />
        <PremiumStatCard label="Live Status" value={stats.active} icon={ActivityIcon} color="purple" index={2} />
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-wrap gap-8 items-end">
        <div className="flex-1 min-w-[280px] space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Archive Search</label>
          <div className="relative group">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Query by name, UUID or digital identity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        </div>
        
        <div className="w-64 space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
          <div className="relative">
            <DeptIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none appearance-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            >
              <option value="">All Domains</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
        </div>

        <div className="w-48 space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tenure</label>
          <div className="relative">
            <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none appearance-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            >
              <option value="">All Cohorts</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">Final Year</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => {setSearch(""); setDepartment(""); setYear("");}}
          className="px-6 py-3.5 text-gray-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-colors"
        >
          Reset Config
        </button>
      </div>

      {/* Premium Table Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-24 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 font-black tracking-widest text-[10px] uppercase">Retrieving Academic Records...</p>
            </div>
          ) : error ? (
            <div className="p-24 text-center">
              <XCircleIcon size={48} className="text-rose-500 mx-auto mb-4 opacity-20" />
              <p className="text-rose-500 font-bold">{error}</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Archive ID</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Legal Identity</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Specialization</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phase</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Health Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <StudentRow 
                      key={student.id} 
                      student={student} 
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-24 text-center">
                      <SearchIcon size={64} className="text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">No Entities Located</h3>
                      <p className="text-sm text-gray-400 mt-1">Refine your query parameters and try again.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
});

StudentsList.displayName = "StudentsList";
export default StudentsList;
