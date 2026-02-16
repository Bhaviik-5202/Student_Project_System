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

    sendResponse(
      res,
      {
        success: true,
        message: "Attendance marked successfully",
        data: attendance,
        error: null,
      },
      201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to mark attendance",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Get all attendance records
 * @route GET /attendance
 * @access Authenticated
 */
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await attendanceService.getAllAttendance();

    sendResponse(
      res,
      {
        success: true,
        message: "Attendance records fetched successfully",
        data: records,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch attendance records",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get attendance records by student ID
 * @route GET /attendance/student/:studentId
 */
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const records = await attendanceService.getAttendanceByStudent(
      req.params.studentId,
    );

    sendResponse(
      res,
      {
        success: true,
        message: "Attendance by student fetched successfully",
        data: records,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch attendance by student",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Get attendance records by date
 * @route GET /attendance/date/:date
 */
exports.getAttendanceByDate = async (req, res) => {
  try {
    const records = await attendanceService.getAttendanceByDate(
      req.params.date,
    );

    sendResponse(
      res,
      {
        success: true,
        message: "Attendance by date fetched successfully",
        data: records,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch attendance by date",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Get attendance record by ID
 * @route GET /attendance/:id
 */
exports.getAttendanceById = async (req, res) => {
  try {
    const record = await attendanceService.getAttendanceById(req.params.id);

    if (!record) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Attendance record not found",
          data: null,
          error: "Invalid attendance ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Attendance record fetched successfully",
        data: record,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch attendance record",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Update attendance record by ID
 * @route PUT /attendance/:id
 */
exports.updateAttendance = async (req, res) => {
  try {
    const updatedRecord = await attendanceService.updateAttendance(
      req.params.id,
      req.body,
    );

    if (!updatedRecord) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Attendance record not found",
          data: null,
          error: "Invalid attendance ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Attendance updated successfully",
        data: updatedRecord,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to update attendance",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Delete attendance record by ID
 * @route DELETE /attendance/:id
 */
exports.deleteAttendance = async (req, res) => {
  try {
    const deleted = await attendanceService.deleteAttendance(req.params.id);

    if (!deleted) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Attendance record not found",
          data: null,
          error: "Invalid attendance ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Attendance record deleted successfully",
        data: null,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to delete attendance",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};
