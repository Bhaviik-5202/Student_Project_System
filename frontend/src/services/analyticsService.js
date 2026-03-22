import api from '../utils/api';

/**
 * Analytics Service
 * Handles dashboard statistics and insights for different user roles
 */
const analyticsService = {
  /**
   * Get main dashboard statistics (Admin)
   */
  getDashboardStats: async () => {
    try {
      return await api.get('/analytics/dashboard');
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch dashboard stats',
      };
    }
  },

  /**
   * Get faculty-specific dashboard statistics
   */
  getFacultyDashboardStats: async () => {
    try {
      return await api.get('/analytics/faculty-dashboard');
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch faculty stats',
      };
    }
  },

  /**
   * Get student-specific dashboard statistics
   */
  getStudentDashboardStats: async () => {
    try {
      return await api.get('/analytics/student-dashboard');
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch student stats',
      };
    }
  },

  /**
   * Get project-specific analytics (Admin/Faculty)
   */
  getProjectAnalytics: async () => {
    try {
      return await api.get('/analytics/projects');
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch project analytics',
      };
    }
  },

  /**
   * Get user engagement analytics (Admin)
   */
  getUserAnalytics: async () => {
    try {
      return await api.get('/analytics/users');
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch user analytics',
      };
    }
  },
};

export default analyticsService;
