const attendanceRepository = require("../repositories/attendance.repository");

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
    const attendance = await attendanceRepository.create(data);
    return response(false, attendance, "Attendance marked");
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
    const attendance = await attendanceRepository.findAll();
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
    const attendance = await attendanceRepository.findAll({ student: studentId });
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
 * Get attendance records by date
 * @param {string} date - Date string
 * @returns {Promise<Array>} List of attendance records for the date
 */
exports.getAttendanceByDate = async (date) => {
    try {
        const attendance = await attendanceRepository.findAll({ date: new Date(date) });
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
 * Get attendance record by ID
 * @param {string} id - Attendance ID
 * @returns {Promise<Object>} Attendance record
 */
exports.getAttendanceById = async (id) => {
    try {
        const attendance = await attendanceRepository.findById(id);
        if (!attendance) return response(true, null, "Attendance record not found");
        return response(false, attendance, "Attendance record fetched");
    } catch (err) {
        return response(true, null, err.message || "Failed to fetch attendance record");
    }
};

/**
 * Update attendance record by ID
 * @param {string} id - Attendance ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated attendance record
 */
exports.updateAttendance = async (id, data) => {
    try {
        const attendance = await attendanceRepository.update(id, data);
        if (!attendance) return response(true, null, "Attendance record not found");
        return response(false, attendance, "Attendance updated");
    } catch (err) {
        return response(true, null, err.message || "Failed to update attendance");
    }
};

/**
 * Delete attendance record by ID
 * @param {string} id - Attendance ID
 * @returns {Promise<Boolean>} Success status
 */
exports.deleteAttendance = async (id) => {
    try {
        const attendance = await attendanceRepository.remove(id);
        if (!attendance) return response(true, null, "Attendance record not found");
        return response(false, true, "Attendance deleted");
    } catch (err) {
        return response(true, null, err.message || "Failed to delete attendance");
    }
};
