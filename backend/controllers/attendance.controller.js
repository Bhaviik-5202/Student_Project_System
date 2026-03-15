const attendanceService = require("../services/attendance.service");
const sendResponse = require("../utils/response");

/**
 * Attendance Controller
 * Manages student attendance tracking, reporting, and updates.
 */

/**
 * Mark or update attendance for a student
 * @route POST /attendance
 * @access Faculty
 */
exports.markAttendance = async (req, res) => {
  try {
    const attendance = await attendanceService.markAttendance(req.body);

    sendResponse(
      res,
      {
        success: !attendance.error,
        message: attendance.error ? attendance.message : "Attendance marked successfully",
        data: attendance.data || null,
        error: attendance.error || null,
      },
      attendance.error ? 400 : 201,
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
 * Fetch all attendance records in the system
 * @route GET /attendance
 * @access Authenticated
 */
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await attendanceService.getAllAttendance();

    sendResponse(
      res,
      {
        success: !records.error,
        message: records.error ? records.message : "Attendance records fetched successfully",
        data: records.data || null,
        error: records.error || null,
      },
      records.error ? 400 : 200,
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
 * Fetch attendance statistics for a specific student
 * @route GET /attendance/student/:studentId
 * @access Authenticated
 */
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const records = await attendanceService.getAttendanceByStudent(
      req.params.studentId,
    );

    sendResponse(
      res,
      {
        success: !records.error,
        message: records.error ? records.message : "Attendance by student fetched successfully",
        data: records.data || null,
        error: records.error || null,
      },
      records.error ? 400 : 200,
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
 * Fetch all attendance records for a specific date
 * @route GET /attendance/date/:date
 * @access Authenticated
 */
exports.getAttendanceByDate = async (req, res) => {
  try {
    const records = await attendanceService.getAttendanceByDate(
      req.params.date,
    );

    sendResponse(
      res,
      {
        success: !records.error,
        message: records.error ? records.message : "Attendance by date fetched successfully",
        data: records.data || null,
        error: records.error || null,
      },
      records.error ? 400 : 200,
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
 * Retrieve a specific attendance record by its ID
 * @route GET /attendance/:id
 * @access Authenticated
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
        success: !record.error,
        message: record.error ? record.message : "Attendance record fetched successfully",
        data: record.data || null,
        error: record.error || null,
      },
      record.error ? 400 : 200,
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
 * Modify an existing attendance record
 * @route PUT /attendance/:id
 * @access Faculty, Admin
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
        success: !updatedRecord.error,
        message: updatedRecord.error ? updatedRecord.message : "Attendance updated successfully",
        data: updatedRecord.data || null,
        error: updatedRecord.error || null,
      },
      updatedRecord.error ? 400 : 200,
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
 * Delete an attendance record from the system
 * @route DELETE /attendance/:id
 * @access Admin
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
