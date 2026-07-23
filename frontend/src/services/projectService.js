import api from '../utils/api';
import { notifyDataChanged } from '../utils/eventBus';

const projectService = {
  getAllProjects: async (params = {}) => {
    try {
      return await api.get('/projects', { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch projects',
      };
    }
  },

  getProjectById: async (id) => {
    try {
      return await api.get(`/projects/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch project',
      };
    }
  },

  createProject: async (projectData) => {
    try {
      const res = await api.post('/projects', projectData);
      if (res.success) notifyDataChanged({ type: 'project_created' });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create project',
      };
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const res = await api.put(`/projects/${id}`, projectData);
      if (res.success) notifyDataChanged({ type: 'project_updated', id });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update project',
      };
    }
  },

  deleteProject: async (id) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.success) notifyDataChanged({ type: 'project_deleted', id });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete project',
      };
    }
  },

  getProjectMembers: async (projectId) => {
    try {
      return await api.get(`/projects/${projectId}/members`);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch project members',
      };
    }
  },

  addProjectMember: async (projectId, userId, role) => {
    try {
      const res = await api.post(`/projects/${projectId}/members`, {
        userId,
        role,
      });
      if (res.success) notifyDataChanged({ type: 'member_added', projectId });
      return res;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add member',
      };
    }
  },

  getProjectTypes: async () => {
    try {
      return await api.get('/projects/types');
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to fetch project types',
      };
    }
  },
};

export default projectService;
