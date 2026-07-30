import api from '../utils/api';
import { notifyDataChanged } from '../utils/eventBus';

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
      const res = await api.post('/staff', staffData);
      if (res.success)
        notifyDataChanged({ type: 'staff_changed', action: 'created' });
      return res;
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
      const res = await api.put(`/staff/${id}`, staffData);
      if (res.success)
        notifyDataChanged({ type: 'staff_changed', action: 'updated', id });
      return res;
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
      const res = await api.delete(`/staff/${id}`);
      if (res.success)
        notifyDataChanged({ type: 'staff_changed', action: 'deleted', id });
      return res;
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
