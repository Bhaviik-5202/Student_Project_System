import api from '../utils/api';

const settingService = {
  getAll: async () => {
    try {
      return await api.get('/settings');
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch settings',
        data: [],
      };
    }
  },

  bulkUpdate: async (settings) => {
    try {
      return await api.put('/settings', { settings });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update settings',
      };
    }
  },

  updateSetting: async (id, data) => {
    try {
      return await api.put(`/settings/${id}`, data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update setting',
      };
    }
  },
};

export default settingService;
