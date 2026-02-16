import api from "../utils/api";

const submissionService = {
  getAllSubmissions: async () => {
    try {
      const response = await api.get("/submissions");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch submissions",
      };
    }
  },

  getSubmissionById: async (id) => {
    try {
      const response = await api.get(`/submissions/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch submission",
      };
    }
  },

  createSubmission: async (submissionData) => {
    try {
      const response = await api.post("/submissions", submissionData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create submission",
      };
    }
  },

  updateSubmission: async (id, submissionData) => {
    try {
      const response = await api.put(`/submissions/${id}`, submissionData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update submission",
      };
    }
  },

  deleteSubmission: async (id) => {
    try {
      await api.delete(`/submissions/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete submission",
      };
    }
  },
};

export default submissionService;
