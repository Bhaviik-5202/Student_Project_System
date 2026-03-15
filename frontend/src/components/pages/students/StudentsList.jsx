/**
 * StudentsList Component
 * 
 * Managed listing of all registered students. Supports advanced 
 * filtering, bulk actions, and direct profile editing.
 */
import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";

import studentService from "../../../services/studentService";

const StudentRow = memo(({ student, onEdit, onDelete }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      {student.id}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
          <i className="fas fa-user text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {student.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {student.phone}
          </p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {student.department}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {student.year}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {student.email}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
        {student.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button onClick={() => onEdit(student.id)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
        <i className="fas fa-edit" />
      </button>
      <button onClick={() => onDelete(student.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
        <i className="fas fa-trash" />
      </button>
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

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

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
      const matchesSearch = search === "" || 
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase());
      const matchesDepartment = department === "" || student.department === department;
      const matchesYear = year === "" || student.year === year;
      return matchesSearch && matchesDepartment && matchesYear;
    });
  }, [students, search, department, year]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
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
            status: student.status || "Active", // Assuming status is still needed for display
          }))
        );
      } else {
        setError(res.message || "Failed to load students");
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const handleEdit = (id) => {
    navigate(`/students/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    const toastId = toast.loading("Deleting student...");
    const res = await studentService.deleteStudent(id);
    
    if (res.success) {
      setStudents(students.filter(s => s.id !== id));
      toast.success("Student deleted successfully", { id: toastId });
    } else {
      toast.error(res.message || "Failed to delete student", { id: toastId });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Student Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage student profiles and enrollments
          </p>
        </div>
        <button onClick={() => navigate("/students/new")} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
          <i className="fas fa-user-plus mr-2" /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <select 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400">
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400">
              <option value="">All Years</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Final Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading students...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <StudentRow key={student.id} student={student} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
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
