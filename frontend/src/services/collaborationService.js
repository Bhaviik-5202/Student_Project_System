import api from '../utils/api';

const collaborationService = {
  // --- Discussions ---
  getDiscussions: async (params = {}) => {
    try {
      const response = await api.get('/collaboration/discussions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getDiscussionById: async (id) => {
    try {
      const response = await api.get(`/collaboration/discussions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createDiscussion: async (data) => {
    try {
      const response = await api.post('/collaboration/discussions', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addReply: async (discussionId, content) => {
    try {
      const response = await api.post(
        `/collaboration/discussions/${discussionId}/replies`,
        { content }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // --- Shared Files ---
  getSharedFiles: async (projectId) => {
    try {
      const response = await api.get(
        `/collaboration/projects/${projectId}/files`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  shareFile: async (projectId, formData) => {
    try {
      const response = await api.post(
        `/collaboration/projects/${projectId}/files`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteFile: async (id) => {
    try {
      const response = await api.delete(`/collaboration/files/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default collaborationService;
