import api from "../utils/api";

const staffService = {
  getAllStaff: async () => {
    try {
      const response = await api.get("/staff");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch staff",
      };
    }
  },

  getStaffById: async (id) => {
    try {
      const response = await api.get(`/staff/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch staff member",
      };
    }
  },

  createStaff: async (staffData) => {
    try {
      const response = await api.post("/staff", staffData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create staff",
      };
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      const response = await api.put(`/staff/${id}`, staffData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update staff",
      };
    }
  },

  deleteStaff: async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete staff",
      };
    }
  },
};

export default staffService;
