import api from "../utils/api";

const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get("/analytics/dashboard");
    return response.data;
  },
  // Add more analytics endpoints as needed
};

export default analyticsService;
