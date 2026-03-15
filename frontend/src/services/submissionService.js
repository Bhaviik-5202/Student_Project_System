import api from "../utils/api";

const submissionService = {
  getSubmissions: async (params = {}) => {
    try {
      return await api.get("/submissions", { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch submissions",
      };
    }
  },

  getSubmissionById: async (id) => {
    try {
      return await api.get(`/submissions/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch submission",
      };
    }
  },

  createSubmission: async (submissionData) => {
    try {
      return await api.post("/submissions", submissionData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create submission",
      };
    }
  },

  updateSubmission: async (id, submissionData) => {
    try {
      return await api.put(`/submissions/${id}`, submissionData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update submission",
      };
    }
  },

  deleteSubmission: async (id) => {
    try {
      return await api.delete(`/submissions/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete submission",
      };
    }
  },

  getHistory: async () => {
    try {
      return await api.get("/submissions/history");
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch submission history",
      };
    }
  },
};

export default submissionService;
