import api from '../utils/api';

const staffService = {
  getAllStaff: async (params = {}) => {
    try {
      return await api.get('/staff', { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch staff',
      };
    }
  },

  getStaffById: async (id) => {
    try {
      return await api.get(`/staff/${id}`);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch staff member',
      };
    }
  },

  createStaff: async (staffData) => {
    try {
      return await api.post('/staff', staffData);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to create staff member',
      };
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      return await api.put(`/staff/${id}`, staffData);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to update staff member',
      };
    }
  },

  deleteStaff: async (id) => {
    try {
      return await api.delete(`/staff/${id}`);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to delete staff member',
      };
    }
  },
};

export default staffService;
