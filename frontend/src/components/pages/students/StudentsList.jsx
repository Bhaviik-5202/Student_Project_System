import React, { memo, useEffect, useState, useMemo, useCallback } from "react";
import {
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  XCircle as XCircleIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Building as DeptIcon
} from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";
import studentService from "../../../services/studentService";

const StudentRow = memo(({ student, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group">
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="text-[10px] font-bold font-mono text-gray-400 dark:text-slate-500">
        #{(student.id || "").toString().slice(-6).toUpperCase()}
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
          <UserIcon size={18} />
        </div>
        <div className="ml-3">
          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            {student.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <MailIcon size={10} className="text-gray-400" />
            {student.email}
          </div>
        </div>
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{student.department}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{student.rollNumber}</span>
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <CalendarIcon size={14} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Year {student.year}</span>
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <span className={`table-status ${student.status === "Active" ? "status-active" : "status-error"}`}>
        {student.status || "Active"}
      </span>
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(student.id)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
          title="Update Profile"
        >
          <EditIcon size={16} />
        </button>
        <button
          onClick={() => onDelete(student.id)}
          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-xl transition-all"
          title="Remove Record"
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
      toast.success("Student record deleted successfully", { id: toastId });
    } else {
      toast.error(res.message || "Failed to delete student", { id: toastId });
    }
  }, [students]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Student Enrollment Centre</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track academic records</p>
        </div>
        <button 
          onClick={() => navigate("/students/new")} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2 uppercase tracking-widest"
        >
          <i className="fas fa-user-plus text-sm"></i>
          Registration Enrollment
        </button>
      </div>


      {/* Basic Filter Toolbar */}
      <div className="card">
        <div className="card-body flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[280px] relative group">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10 pointer-events-none" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 w-[1px] h-5 bg-gray-200 dark:bg-slate-700 z-10" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control pl-16 bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 focus:bg-white transition-all"
            />
          </div>

          <div className="w-56 relative group">
            <DeptIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10 pointer-events-none" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 w-[1px] h-5 bg-gray-200 dark:bg-slate-700 z-10" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="form-control pl-16 appearance-none bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div className="w-48 relative group">
            <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10 pointer-events-none" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 w-[1px] h-5 bg-gray-200 dark:bg-slate-700 z-10" />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="form-control pl-16 appearance-none bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">Final Year</option>
            </select>
          </div>

          <button
            onClick={() => { setSearch(""); setDepartment(""); setYear(""); }}
            className="btn btn-secondary px-6"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Standard Table View */}
      <div className="table-container shadow-sm">
        <table className="table">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-slate-900/50">
              <th className="w-24 px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Info</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Record Details</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Academic</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="text-right px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody>
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
                <td colSpan="6" className="py-20 text-center text-gray-400 italic font-medium">
                  {loading ? "Accessing student archives..." : "No matching records found in the registry."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
});

StudentsList.displayName = "StudentsList";
export default StudentsList;