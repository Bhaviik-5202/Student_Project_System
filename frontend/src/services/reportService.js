import api from '../utils/api';

const reportService = {
  getProjectStatusReport: async (params = {}) => {
    try {
      const response = await api.get('/analytics/dashboard', { params });
      return response; // api.js already returns response.data
    } catch (error) {
      console.error('Fetch report data failed', error);
      throw error;
    }
  },

  getRecentReports: async () => {
    try {
      return await api.get('/reports');
    } catch (error) {
      console.error('Fetch recent reports failed', error);
      throw error;
    }
  },

  createReport: async (reportData) => {
    try {
      return await api.post('/reports', reportData);
    } catch (error) {
      console.error('Create report failed', error);
      throw error;
    }
  },

  deleteReport: async (id) => {
    try {
      return await api.delete(`/reports/${id}`);
    } catch (error) {
      console.error('Delete report failed', error);
      throw error;
    }
  },

  updateReport: async (id, updateData) => {
    try {
      return await api.put(`/reports/${id}`, updateData);
    } catch (error) {
      console.error('Update report failed', error);
      throw error;
    }
  },

  exportReport: async (reportId, format) => {
    try {
      // In a real app, this would be a proper export endpoint
      return await api.get(
        `/analytics/dashboard?export=${format}&reportId=${reportId}`
      );
    } catch (error) {
      console.error('Export failed', error);
      throw error;
    }
  },
};

export default reportService;
