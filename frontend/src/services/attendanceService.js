import api from "../utils/api";

const attendanceService = {
  getAttendanceByStudent: async (studentId) => {
    try {
      return await api.get(`/attendance/student/${studentId}`);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch attendance records",
      };
    }
  },

  getAllAttendance: async () => {
    try {
      return await api.get("/attendance");
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch all attendance records",
      };
    }
  },

  markAttendance: async (attendanceData) => {
    try {
      return await api.post("/attendance", attendanceData);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to mark attendance",
      };
    }
  },
};

export default attendanceService;
