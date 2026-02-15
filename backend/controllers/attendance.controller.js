const attendanceService = require("../services/attendance.service");
const sendResponse = require("../utils/response");

/**
 * Mark attendance for a student
 * @route POST /attendance
 * @access Faculty
 */
exports.markAttendance = async (req, res) => {
  try {
    const attendance = await attendanceService.markAttendance(req.body);
    sendResponse(res, { error: false, data: attendance, message: "Attendance marked" }, 201);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to mark attendance" }, 400);
  }
};

/**
 * Get all attendance records with pagination and filtering
 * @route GET /attendance
 * @access Authenticated
 * @query page, limit, student, date, etc.
 */
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await attendanceService.getAllAttendance();
    sendResponse(res, { error: false, data: records, message: "Attendance records fetched" }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to fetch attendance records" }, 400);
  }
};

/**
 * Get attendance records by student ID
 * @route GET /attendance/student/:studentId
 * @access Authenticated
 */
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const records = await attendanceService.getAttendanceByStudent(req.params.studentId);
    sendResponse(res, { error: false, data: records, message: "Attendance by student fetched" }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to fetch attendance by student" }, 400);
  }
};
