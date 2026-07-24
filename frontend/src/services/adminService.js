import api from '../utils/api';

const adminService = {
  getBackups: async () => {
    try {
      return await api.get('/admin/backups');
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch backups',
        data: [],
      };
    }
  },

  createBackup: async (backupData = {}) => {
    try {
      return await api.post('/admin/backups', backupData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create backup',
      };
    }
  },

  restoreBackup: async (backupId) => {
    try {
      return await api.post(`/admin/backups/${backupId}/restore`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to restore backup',
      };
    }
  },

  deleteBackup: async (backupId) => {
    try {
      return await api.delete(`/admin/backups/${backupId}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete backup',
      };
    }
  },

  getUsers: async () => {
    try {
      return await api.get('/admin/users');
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
        data: [],
      };
    }
  },
};

export default adminService;
