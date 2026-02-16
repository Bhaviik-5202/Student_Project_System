import api from "../utils/api";


const meetingService = {
  getAllMeetings: async (params = {}) => {
    try {
      const response = await api.get("/meetings", { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch meetings",
      };
    }
  },

  getMeetingById: async (id) => {
    try {
      const response = await api.get(`/meetings/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch meeting",
      };
    }
  },

  createMeeting: async (meetingData) => {
    try {
      const response = await api.post("/meetings", meetingData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create meeting",
      };
    }
  },

  updateMeeting: async (id, meetingData) => {
    try {
      const response = await api.put(`/meetings/${id}`, meetingData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update meeting",
      };
    }
  },

  deleteMeeting: async (id) => {
    try {
      await api.delete(`/meetings/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete meeting",
      };
    }
  },

  joinMeeting: async (meetingId) => {
    try {
      const response = await api.post(`/meetings/${meetingId}/join`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to join meeting",
      };
    }
  },
};

export default meetingService;
