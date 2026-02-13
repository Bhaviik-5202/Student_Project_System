const attendanceService = require("../services/attendanceService");
const ApiError = require("../utils/ApiError");

// Get all attendance records
exports.getAllAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.findAll();
    return res.json({ success: true, data: records });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch attendance records", [err.message]),
    );
  }
};

// Get attendance by student ID
exports.getAttendanceByStudent = async (req, res, next) => {
  try {
    const records = await attendanceService.findByStudent(req.params.id);
    return res.json({ success: true, data: records });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch attendance by student", [err.message]),
    );
  }
};

// Mark attendance
exports.markAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.create(req.body);
    return res.status(201).json({ success: true, data: attendance });
  } catch (err) {
    return next(new ApiError(400, "Failed to mark attendance", [err.message]));
  }
};
