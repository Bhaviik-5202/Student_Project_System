import api from "./api";

const projectService = {
  getAllProjects: async (params = {}) => {
    try {
      const response = await api.get("/projects", { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch projects",
      };
    }
  },

  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch project",
      };
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await api.post("/projects", projectData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create project",
      };
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update project",
      };
    }
  },

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete project",
      };
    }
  },

  getProjectMembers: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/members`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch project members",
      };
    }
  },

  addProjectMember: async (projectId, userId, role) => {
    try {
      const response = await api.post(`/projects/${projectId}/members`, {
        userId,
        role,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add member",
      };
    }
  },
};

export default projectService;
