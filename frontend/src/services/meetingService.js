import api from "../utils/api";

const meetingService = {
  getMeetings: async (params = {}) => {
    try {
      return await api.get("/meetings", { params });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch meetings",
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
        message: error.response?.data?.message || "Failed to fetch meeting",
      };
    }
  },

  createMeeting: async (meetingData) => {
    try {
      return await api.post("/meetings", meetingData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create meeting",
      };
    }
  },

  updateMeeting: async (id, meetingData) => {
    try {
      return await api.put(`/meetings/${id}`, meetingData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update meeting",
      };
    }
  },

  deleteMeeting: async (id) => {
    try {
      return await api.delete(`/meetings/${id}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete meeting",
      };
    }
  },
};

export default meetingService;
