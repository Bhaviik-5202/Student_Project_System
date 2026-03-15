import api from "../utils/api";

const projectService = {
  getAllProjects: async (params = {}) => {
    try {
      return await api.get("/projects", { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch projects",
      };
    }
  },

  getProjectById: async (id) => {
    try {
      return await api.get(`/projects/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch project",
      };
    }
  },

  createProject: async (projectData) => {
    try {
      return await api.post("/projects", projectData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create project",
      };
    }
  },

  updateProject: async (id, projectData) => {
    try {
      return await api.put(`/projects/${id}`, projectData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update project",
      };
    }
  },

  deleteProject: async (id) => {
    try {
      return await api.delete(`/projects/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete project",
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
          error.response?.data?.message || "Failed to fetch project members",
      };
    }
  },

  addProjectMember: async (projectId, userId, role) => {
    try {
      return await api.post(`/projects/${projectId}/members`, {
        userId,
        role,
      });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add member",
      };
    }
  },
};

export default projectService;
