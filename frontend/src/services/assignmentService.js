import api from "../utils/api";

const assignmentService = {
  getAll: async (params = {}) => {
    try {
      return await api.get("/assignments", { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch assignments",
      };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/assignments/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch assignment",
      };
    }
  },

  create: async (data) => {
    try {
      return await api.post("/assignments", data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create assignment",
      };
    }
  },

  update: async (id, data) => {
    try {
      return await api.put(`/assignments/${id}`, data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update assignment",
      };
    }
  },

  remove: async (id) => {
    try {
      return await api.delete(`/assignments/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete assignment",
      };
    }
  },
};

export default assignmentService;
