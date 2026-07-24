import api from '../utils/api';
import { notifyDataChanged } from '../utils/eventBus';

const studentService = {
  getAllStudents: async (params = {}) => {
    try {
      return await api.get('/students', { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students',
      };
    }
  },

  getStudentById: async (id) => {
    try {
      return await api.get(`/students/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student',
      };
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      const res = await api.put(`/students/${id}`, studentData);
      if (res.success) notifyDataChanged({ type: 'student_updated', id });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student',
      };
    }
  },

  deleteStudent: async (id) => {
    try {
      const res = await api.delete(`/students/${id}`);
      if (res.success) notifyDataChanged({ type: 'student_deleted', id });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete student',
      };
    }
  },

  getStudentProjects: async (studentId) => {
    try {
      return await api.get(`/students/${studentId}/projects`);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch student projects',
      };
    }
  },

  getStudentGrades: async (studentId) => {
    try {
      return await api.get(`/students/${studentId}/grades`);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch student grades',
      };
    }
  },
};

export default studentService;
