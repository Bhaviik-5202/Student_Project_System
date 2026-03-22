import api from '../utils/api';

const timelineService = {
  getAll: async () => {
    try {
      return await api.get('/timelines');
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch timelines',
      };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/timelines/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch timeline',
      };
    }
  },

  getByProject: async (projectId) => {
    try {
      return await api.get(`/timelines/project/${projectId}`);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch project timeline',
      };
    }
  },

  create: async (data) => {
    try {
      return await api.post('/timelines', data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create timeline',
      };
    }
  },

  update: async (id, data) => {
    try {
      return await api.put(`/timelines/${id}`, data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update timeline',
      };
    }
  },

  remove: async (id) => {
    try {
      return await api.delete(`/timelines/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete timeline',
      };
    }
  },
};

export default timelineService;
