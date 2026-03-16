/**
 * StudentsList Component
 * 
 * Managed listing of all registered students. Supports advanced 
 * filtering, bulk actions, and direct profile editing.
 */
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

const StudentRow = memo(({ student, onEdit, onDelete }) => (
  <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
        #{(student.id || student._id || "").toString().slice(-6).toUpperCase()}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform duration-200">
          <UserIcon size={18} />
        </div>
        <div className="ml-4">
          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {student.name}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <PhoneIcon size={12} className="mr-1 opacity-70" />
            {student.phone}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
        {student.department}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
        Year {student.year}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <MailIcon size={14} className="mr-2 opacity-70" />
        {student.email}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        student.status === "Active" 
          ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-400"
          : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/40 dark:border-red-800 dark:text-red-400"
      }`}>
        {student.status === "Active" ? <CheckCircleIcon size={12} className="mr-1" /> : <XCircleIcon size={12} className="mr-1" />}
        {student.status || "Active"}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={() => onEdit(student.id)}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all transform hover:scale-110"
          title="Edit Profile"
        >
          <EditIcon size={16} />
        </button>
        <button 
          onClick={() => onDelete(student.id)}
          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all transform hover:scale-110"
          title="Delete Record"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </td>
  </tr>
));

StudentRow.displayName = "StudentRow";
StudentRow.propTypes = {
  student: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

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
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Premium Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-none p-6 md:p-8 transition-all duration-300">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1 flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
              <GradIcon size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Student Enrollment Center
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <UsersIcon size={14} className="mr-2" />
                Manage academic profiles and enrollment status
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/students/new")} 
            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-xl hover:shadow-2xl hover:shadow-indigo-300 dark:hover:shadow-none transition-all duration-300 font-bold overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <UserPlusIcon size={20} className="mr-2 group-hover:scale-110 transition-transform" />
            Enroll Student
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Students", value: stats.total, icon: UsersIcon, color: "blue" },
          { label: "Departments", value: stats.departments, icon: DeptIcon, color: "purple" },
          { label: "Active Status", value: stats.active, icon: ActivityIcon, color: "green" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex items-center">
            <div className={`p-4 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 mr-5 group-hover:rotate-12 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Advanced Filters Toolbar */}
        <div className="p-5 md:p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-5 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Search Registry</label>
              <div className="relative">
                <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID, Name or Email address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white shadow-sm"
                />
              </div>
            </div>
            <div className="lg:col-span-3 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Department</label>
              <div className="relative">
                <DeptIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-gray-900 dark:text-white shadow-sm"
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Academic Year</label>
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-gray-900 dark:text-white shadow-sm"
                >
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">Final Year</option>
                </select>
              </div>
            </div>
            <div className="lg:col-span-2">
              <button 
                onClick={() => {setSearch(""); setDepartment(""); setYear("");}}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center transition-all shadow-sm"
              >
                <ResetIcon size={18} className="mr-2" /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-24 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 mb-4" />
              <p className="text-gray-400 font-bold tracking-tight">Syncing encrypted records...</p>
            </div>
          ) : error ? (
            <div className="p-24 text-center">
              <XCircleIcon size={64} className="mx-auto text-red-100 mb-6" />
              <h3 className="text-xl font-bold text-red-600 mb-2">Service Outage</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-all">Retry Handshake</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900/40">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Entry ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name & Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Academic Year</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Digital Mailbox</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <StudentRow key={student.id} student={student} onEdit={handleEdit} onDelete={handleDelete} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-32">
                      <SearchIcon size={64} className="mx-auto text-slate-100 dark:text-slate-700 mb-6" />
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Matching Profiles</h3>
                      <p className="text-gray-400 max-w-sm mx-auto">Adjust your search filters or add a new enrollment to populate the registry.</p>
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
