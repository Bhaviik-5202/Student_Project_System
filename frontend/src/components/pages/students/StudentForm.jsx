import React, { useState, memo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
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
      const toastId = toast.loading(isEditing ? "Updating student..." : "Adding student...");
      
      try {
        const res = isEditing 
          ? await studentService.updateStudent(id, formData)
          : await studentService.createStudent(formData);
          
        if (res.success) {
          toast.success(`Student ${isEditing ? "updated" : "added"} successfully!`, { id: toastId });
          navigate("/students");
        } else {
          toast.error(res.message || "Failed to save student", { id: toastId });
        }
      } catch (error) {
        toast.error("An error occurred", { id: toastId });
      }
    },
    [formData, id, isEditing, navigate],
  );

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Roll Number
        </label>
        <input
          type="text"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        {isEditing ? "Update Student" : "Add Student"}
      </button>
    </form>
  );
});

StudentForm.displayName = "StudentForm";

export default StudentForm;
