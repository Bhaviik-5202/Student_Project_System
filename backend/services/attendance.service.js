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
 * Mark attendance for a student
 * @param {Object} data - Attendance data payload
 * @returns {Promise<Object>} Formatted service response
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
 * Fetch all attendance records
 * @returns {Promise<Object>} Formatted service response with attendance list
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
 * Get attendance records by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} Formatted service response with student attendance
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
 * Get attendance records by date
 * @param {string} date - Date string
 * @returns {Promise<Object>} Formatted service response with daily attendance
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
 * @param {string} id - Attendance ID
 * @returns {Promise<Object>} Formatted service response with attendance data
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
 * Update attendance record by ID
 * @param {string} id - Attendance ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated record
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
 * Delete attendance record by ID
 * @param {string} id - Attendance ID
 * @returns {Promise<Object>} Formatted service response
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
