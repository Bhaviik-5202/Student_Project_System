/**
 * Attendance Service
 * Business logic layer for student attendance tracking.
 */
const attendanceRepository = require('../repositories/attendance.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Register student attendance
 * @param {Object} data - Attendance data payload
 * @returns {Promise<Object>} Formatted service response with new attendance entry
 */
exports.markAttendance = async (data) => {
  try {
    const attendance = await attendanceRepository.create(data);
    return response(false, attendance, 'Attendance marked successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to mark attendance');
  }
};

/**
 * Get all attendance records
 * @returns {Promise<Object>} Formatted service response with system-wide logs
 */
exports.getAllAttendance = async () => {
  try {
    const attendance = await attendanceRepository.findAll();
    return response(
      false,
      attendance,
      'Attendance records fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch attendance records'
    );
  }
};

/**
 * Get attendance by student
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with student's log history
 */
exports.getAttendanceByStudent = async (studentId) => {
  try {
    const attendance = await attendanceRepository.findAll(
      { student: studentId },
      { populate: 'meeting' }
    );
    return response(
      false,
      attendance,
      'Student attendance records fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch student attendance records'
    );
  }
};

/**
 * Get attendance by date
 * @param {string} date - ISO Date string
 * @returns {Promise<Object>} Formatted service response with daily session logs
 */
exports.getAttendanceByDate = async (date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await attendanceRepository.findAll({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    return response(
      false,
      attendance,
      'Daily attendance records fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch daily attendance records'
    );
  }
};

/**
 * Get attendance record by ID
 * @param {string} id - Attendance identifier
 * @returns {Promise<Object>} Formatted service response with specific record data
 */
exports.getAttendanceById = async (id) => {
  try {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) return response(true, null, 'Attendance record not found');
    return response(
      false,
      attendance,
      'Attendance record fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch attendance record'
    );
  }
};

/**
 * Update attendance record
 * @param {string} id - Attendance identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated log entry
 */
exports.updateAttendance = async (id, data) => {
  try {
    const attendance = await attendanceRepository.update(id, data);
    if (!attendance) return response(true, null, 'Attendance record not found');
    return response(false, attendance, 'Attendance updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update attendance');
  }
};

/**
 * Remove attendance record
 * @param {string} id - Attendance identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.deleteAttendance = async (id) => {
  try {
    const attendance = await attendanceRepository.remove(id);
    if (!attendance) return response(true, null, 'Attendance record not found');
    return response(false, null, 'Attendance deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete attendance');
  }
};
