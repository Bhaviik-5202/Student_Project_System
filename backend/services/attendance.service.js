const Attendance = require("../models/attendance.model");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Mark attendance for a student
 * @param {Object} data - Attendance data
 * @returns {Promise<Object>} Created attendance record
 */
exports.markAttendance = async (data) => {
  try {
    const attendance = new Attendance(data);
    const savedAttendance = await attendance.save();
    return response(false, savedAttendance, "Attendance marked");
  } catch (err) {
    return response(true, null, err.message || "Failed to mark attendance");
  }
};

/**
 * Get all attendance records
 * @returns {Promise<Array>} List of attendance records
 */
exports.getAllAttendance = async () => {
  try {
    const attendance = await Attendance.find();
    return response(false, attendance, "Attendance records fetched");
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch attendance records",
    );
  }
};

/**
 * Get attendance records by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} List of attendance records for the student
 */
exports.getAttendanceByStudent = async (studentId) => {
  try {
    const attendance = await Attendance.find({ student: studentId });
    return response(false, attendance, "Attendance records fetched");
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch attendance records",
    );
  }
};
