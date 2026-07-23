import api from '../utils/api';
import { notifyDataChanged } from '../utils/eventBus';

const meetingService = {
  getMeetings: async (params = {}) => {
    try {
      return await api.get('/meetings', { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch meetings',
      };
    }
  },

  getAllMeetings: async (params = {}) => {
    return await meetingService.getMeetings(params);
  },

  getMeetingById: async (id) => {
    try {
      return await api.get(`/meetings/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch meeting',
      };
    }
  },

  createMeeting: async (meetingData) => {
    try {
      const res = await api.post('/meetings', meetingData);
      if (res.success) notifyDataChanged({ type: 'meeting_created' });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create meeting',
      };
    }
  },

  updateMeeting: async (id, meetingData) => {
    try {
      const res = await api.put(`/meetings/${id}`, meetingData);
      if (res.success) notifyDataChanged({ type: 'meeting_updated', id });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update meeting',
      };
    }
  },

  deleteMeeting: async (id) => {
    try {
      const res = await api.delete(`/meetings/${id}`);
      if (res.success) notifyDataChanged({ type: 'meeting_deleted', id });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete meeting',
      };
    }
  },
};

export default meetingService;
