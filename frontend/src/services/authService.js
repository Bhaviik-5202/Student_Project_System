import api from "../utils/api";
import { LOCAL_STORAGE_KEYS, ROLES } from "../utils/constants";

/**
 * Authentication Service
 * Handles all authentication-related API calls and user state management
 */
const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response
   */
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      // The interceptor now returns the standardized object { success, message, data }
      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ROLE, user.role);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  /**
   * Register new user
   * @param {Object} formData - Registration form data
   * @returns {Promise<Object>} Registration response
   */
  register: async (formData) => {
    try {
      return await api.post("/auth/register", formData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get current logged-in user
   * @returns {Object|null} Current user object or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get authentication token
   * @returns {string|null} Auth token or null
   */
  getToken: () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  },

  /**
   * Get refresh token
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken: () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Check if token is valid
   * @param {string} token - Token to validate
   * @returns {boolean} True if token is valid
   */
  isTokenValid: (token) => {
    if (!token) return false;
    try {
      // Decode JWT token (basic check)
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      const decoded = JSON.parse(atob(parts[1]));
      // Check if token is expired
      if (decoded.exp) {
        return decoded.exp * 1000 > Date.now();
      }
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    return !!token && authService.isTokenValid(token);
  },

  /**
   * Check if user has specific role
   * @param {string|Array} role - Role(s) to check
   * @returns {boolean} True if user has the role
   */
  hasRole: (role) => {
    const userRole = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ROLE);
    if (!userRole) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  },

  /**
   * Check if user has specific permission
   * @param {string} userRole - User role
   * @param {string} permission - Permission to check
   * @returns {boolean} True if user has the permission
   */
  hasPermission: (userRole, permission) => {
    // Define role-based permissions
    const rolePermissions = {
      [ROLES.ADMIN]: [
        "view_all_projects",
        "create_project",
        "edit_project",
        "delete_project",
        "view_all_students",
        "manage_users",
        "view_reports",
        "export_data",
      ],
      [ROLES.FACULTY]: [
        "view_assigned_projects",
        "view_assigned_students",
        "create_project",
        "edit_assigned_project",
        "view_reports",
        "schedule_meetings",
      ],
      [ROLES.STUDENT]: [
        "view_assigned_projects",
        "submit_project",
        "view_meetings",
        "view_grades",
        "edit_profile",
      ],
    };

    return rolePermissions[userRole]?.includes(permission) || false;
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Update response
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);
      if (response.success && response.data) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.USER,
          JSON.stringify(response.data),
        );
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password response
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      return await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password change failed",
      };
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} Refresh response
   */
  refreshToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        return { success: false, message: "No refresh token available" };
      }

      const response = await api.post("/auth/refresh-token", {
        refreshToken,
      });

      if (response.success && response.data) {
        const { token, refreshToken: newRefreshToken } = response.data;
        if (token) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
        }
        if (newRefreshToken) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }
      }

      return response;
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      return {
        success: false,
        message: error.response?.data?.message || "Token refresh failed",
      };
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request response
   */
  requestPasswordReset: async (email) => {
    try {
      return await api.post("/auth/forgot-password", { email });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Request failed",
      };
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Reset response
   */
  resetPassword: async (token, newPassword) => {
    try {
      return await api.post("/auth/reset-password", {
        token,
        password: newPassword,
      });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Reset failed",
      };
    }
  },
};

export default authService;
