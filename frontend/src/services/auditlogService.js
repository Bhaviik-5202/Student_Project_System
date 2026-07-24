import api from '../utils/api';

/**
 * Audit Log Service
 * Handles system audit logs and activity tracking for Admin Dashboard.
 */
const auditlogService = {
  /**
   * Fetch all system audit logs
   * @param {Object} params - Query parameters (page, limit, filter, sort)
   */
  getAllAuditLogs: async (params = {}) => {
    try {
      return await api.get('/audit-logs', { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch audit logs',
        data: [],
      };
    }
  },

  /**
   * Get a specific audit log by ID
   * @param {string} id - Audit log ID
   */
  getAuditLogById: async (id) => {
    try {
      return await api.get(`/audit-logs/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch audit log',
      };
    }
  },
};

export default auditlogService;
