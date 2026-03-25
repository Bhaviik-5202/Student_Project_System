const attendanceService = require('../services/attendance.service');
const sendResponse = require('../utils/response');

/**
 * Attendance Controller
 * Manages student attendance tracking, reporting, and updates.
 */

/**
 * Mark student attendance
 * @route   POST /api/attendance
 * @desc    Log presence or absence for a student in a specific session
 * @access  Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAttendance = async (req, res) => {
  try {
    const attendance = await attendanceService.markAttendance(req.body);

    sendResponse(
      res,
      {
        success: !attendance.error,
        message: attendance.error
          ? attendance.message
          : 'Attendance marked successfully',
        data: attendance.data || null,
        error: attendance.error || null,
      },
      attendance.error ? 400 : 201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to mark attendance',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all attendance records
 * @route   GET /api/attendance
 * @desc    Retrieve comprehensive list of all system-wide attendance entries
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await attendanceService.getAllAttendance();

    sendResponse(
      res,
      {
        success: !records.error,
        message: records.error
          ? records.message
          : 'Attendance records fetched successfully',
        data: records.data || null,
        error: records.error || null,
      },
      records.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch attendance records',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get attendance by student
 * @route   GET /api/attendance/student/:studentId
 * @desc    Retrieve all historical attendance records for a specific student
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const records = await attendanceService.getAttendanceByStudent(
      req.params.studentId
    );

    sendResponse(
      res,
      {
        success: !records.error,
        message: records.error
          ? records.message
          : 'Attendance by student fetched successfully',
        data: records.data || null,
        error: records.error || null,
      },
      records.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch attendance by student',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Get daily attendance records
 * @route   GET /api/attendance/date/:date
 * @desc    Retrieve all attendance marked on a specific calendar date
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAttendanceByDate = async (req, res) => {
  try {
    const records = await attendanceService.getAttendanceByDate(
      req.params.date
    );

    sendResponse(
      res,
      {
        success: !records.error,
        message: records.error
          ? records.message
          : 'Attendance by date fetched successfully',
        data: records.data || null,
        error: records.error || null,
      },
      records.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch attendance by date',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Get attendance record by ID
 * @route   GET /api/attendance/:id
 * @desc    Retrieve detailed information for a single attendance entry
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAttendanceById = async (req, res) => {
  try {
    const record = await attendanceService.getAttendanceById(req.params.id);

    if (!record) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Attendance record not found',
          data: null,
          error: 'Invalid attendance ID',
        },
        404
      );
    }

    sendResponse(
      res,
      {
        success: !record.error,
        message: record.error
          ? record.message
          : 'Attendance record fetched successfully',
        data: record.data || null,
        error: record.error || null,
      },
      record.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch attendance record',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Update attendance record
 * @route   PUT /api/attendance/:id
 * @desc    Modify state or notes for an existing attendance log
 * @access  Faculty, Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateAttendance = async (req, res) => {
  try {
    const updatedRecord = await attendanceService.updateAttendance(
      req.params.id,
      req.body
    );

    if (!updatedRecord) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Attendance record not found',
          data: null,
          error: 'Invalid attendance ID',
        },
        404
      );
    }

    sendResponse(
      res,
      {
        success: !updatedRecord.error,
        message: updatedRecord.error
          ? updatedRecord.message
          : 'Attendance updated successfully',
        data: updatedRecord.data || null,
        error: updatedRecord.error || null,
      },
      updatedRecord.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to update attendance',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Delete attendance record
 * @route   DELETE /api/attendance/:id
 * @desc    Permanently remove an attendance entry from the database
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteAttendance = async (req, res) => {
  try {
    const deleted = await attendanceService.deleteAttendance(req.params.id);

    if (!deleted) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Attendance record not found',
          data: null,
          error: 'Invalid attendance ID',
        },
        404
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: 'Attendance record deleted successfully',
        data: null,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to delete attendance',
        data: null,
        error: error.message,
      },
      400
    );
  }
};
