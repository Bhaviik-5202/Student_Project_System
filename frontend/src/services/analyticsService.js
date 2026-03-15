import api from "../utils/api";

const analyticsService = {
  getStats: async (params = {}) => {
    try {
      return await api.get("/analytics/stats", { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch statistics",
      };
    }
  },

  getChartData: async (type, params = {}) => {
    try {
      return await api.get(`/analytics/charts/${type}`, { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch chart data",
      };
    }
  },

  getSummary: async () => {
    try {
      return await api.get("/analytics/summary");
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch summary",
      };
    }
  },
};

export default analyticsService;
