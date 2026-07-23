import api from '../utils/api';

const resourceService = {
  getAll: async (params = {}) => {
    try {
      return await api.get('/resources', { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch resources',
        data: [],
      };
    }
  },

  upload: async (formData) => {
    try {
      return await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload resource',
      };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/resources/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch resource',
      };
    }
  },

  update: async (id, data) => {
    try {
      return await api.put(`/resources/${id}`, data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update resource',
      };
    }
  },

  delete: async (id) => {
    try {
      return await api.delete(`/resources/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete resource',
      };
    }
  },

  download: async (id, fileName = 'resource') => {
    try {
      const response = await api.get(`/resources/${id}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      return { success: true, message: 'Download initiated successfully' };
    } catch (error) {
      const token = (localStorage.getItem('token') || '')
        .replace(/^"|"$/g, '')
        .trim();
      const downloadUrl = `/api/v1/resources/${id}/download?token=${encodeURIComponent(token)}`;
      window.open(downloadUrl, '_blank');
      return { success: true, message: 'Opening download link...' };
    }
  },

  preview: async (id) => {
    try {
      return await api.get(`/resources/${id}/preview`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to preview resource',
      };
    }
  },
};

export default resourceService;
