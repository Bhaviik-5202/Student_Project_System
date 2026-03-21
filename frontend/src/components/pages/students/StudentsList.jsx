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
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import studentService from "../../../services/studentService";

const StudentRow = memo(({ student, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="text-xs font-mono text-gray-500">
        #{(student.id || "").toString().slice(-6).toUpperCase()}
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <UserIcon size={16} />
        </div>
        <div className="ml-3">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {student.name}
          </div>
          <div className="text-xs text-gray-500">
            {student.email}
          </div>
        </div>
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {student.department}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      Year {student.year}
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${student.status === "Active"
          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
        }`}>
        {student.status || "Active"}
      </span>
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
      <button
        onClick={() => onEdit(student.id)}
        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-md mr-2"
        title="Edit"
      >
        <EditIcon size={16} />
      </button>
      <button
        onClick={() => onDelete(student.id)}
        className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md"
        title="Delete"
      >
        <TrashIcon size={16} />
      </button>
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
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <UsersIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Student Enrollment Center</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage student academic records</p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/students/new")} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          <UserPlusIcon size={18} className="mr-2" />
          Registry Enrollment
        </button>
      </div>

      {/* Basic Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <div className="w-48 relative">
          <DeptIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm outline-none appearance-none"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        <div className="w-40 relative">
          <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm outline-none appearance-none"
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
          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Standard Table View */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium">Loading students...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <XCircleIcon size={32} className="text-red-500 mx-auto mb-2 opacity-50" />
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
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
                    <td colSpan="6" className="p-12 text-center text-gray-400">
                      No records found matching your filters.
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