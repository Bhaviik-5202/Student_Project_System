import api from "./api";

const studentService = {
  getAllStudents: async (params = {}) => {
    try {
      const response = await api.get("/students", { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch students",
      };
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch student",
      };
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await api.post("/students", studentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create student",
      };
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update student",
      };
    }
  },

  deleteStudent: async (id) => {
    try {
      await api.delete(`/students/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete student",
      };
    }
  },

  getStudentProjects: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/projects`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch student projects",
      };
    }
  },

  getStudentGrades: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/grades`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch student grades",
      };
    }
  },
};

export default studentService;
