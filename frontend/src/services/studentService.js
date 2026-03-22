import api from '../utils/api';

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

  createStudent: async (studentData) => {
    try {
      return await api.post('/students', studentData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create student',
      };
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      return await api.put(`/students/${id}`, studentData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student',
      };
    }
  },

  deleteStudent: async (id) => {
    try {
      return await api.delete(`/students/${id}`);
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
