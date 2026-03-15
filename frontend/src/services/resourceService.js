import api from "../utils/api";

const resourceService = {
  getAll: async (params = {}) => {
    try {
      return await api.get("/resources", { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch resources",
      };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/resources/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch resource",
      };
    }
  },
};

export default resourceService;
