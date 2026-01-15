import api from "./api";
import { ROUTES } from "./constants";

const authService = {
  login: async (email, password, role) => {
    try {
      const response = await api.post("/auth/login", { email, password, role });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", response.data.user.role);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = ROUTES.LOGIN;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  hasRole: (role) => {
    const userRole = localStorage.getItem("role");
    return userRole === role;
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  },
};

export default authService;
