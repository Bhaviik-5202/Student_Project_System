const assignmentRepository = require("../repositories/assignment.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create a new academic assignment
 * @param {Object} data - Assignment creation payload
 * @returns {Promise<Object>} Formatted service response with new assignment data
 */
exports.create = async (data) => {
  try {
    const assignment = await assignmentRepository.create(data);
    return response(false, assignment, "Assignment created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create assignment");
  }
};

/**
 * Fetch all assignments with optional pagination and filtering
 * @param {Object} options - Query and pagination options
 * @returns {Promise<Object>} Formatted service response with assignment list
 */
exports.getAll = async (options = {}) => {
  try {
    const { page = 1, limit = 10, filters = {} } = options;
    const assignments = await assignmentRepository.findAll(filters, {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
    });
    return response(false, assignments, "Assignments fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch assignments");
  }
};

/**
 * Get detailed assignment information by ID
 * @param {string} id - Assignment identifier
 * @returns {Promise<Object>} Formatted service response with assignment data
 */
exports.getById = async (id) => {
  try {
    const assignment = await assignmentRepository.findById(id);
    if (!assignment) return response(true, null, "Assignment not found");
    return response(false, assignment, "Assignment fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch assignment");
  }
};

/**
 * Update an existing assignment's details
 * @param {string} id - Assignment identifier
 * @param {Object} data - Updated attribute data
 * @returns {Promise<Object>} Formatted service response with updated assignment
 */
exports.update = async (id, data) => {
  try {
    const assignment = await assignmentRepository.update(id, data);
    if (!assignment) return response(true, null, "Assignment not found");
    return response(false, assignment, "Assignment updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update assignment");
  }
};

/**
 * Permanently delete an assignment record
 * @param {string} id - Assignment identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const assignment = await assignmentRepository.remove(id);
    if (!assignment) return response(true, null, "Assignment not found");
    return response(false, null, "Assignment deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete assignment");
  }
};

/**
 * Fetch all assignments assigned to a specific student
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with assignments
 */
exports.getByStudentId = async (studentId) => {
  try {
    const assignments = await assignmentRepository.findAll({
      student: studentId,
    });
    return response(
      false,
      assignments,
      "Student assignments fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch student assignments",
    );
  }
};

/**
 * Get all assignments associated with a specific project activity
 * @param {string} activityId - Activity identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with assignments
 */
exports.getByActivityId = async (activityId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { activity: activityId },
      options,
    );
    return response(
      false,
      assignments,
      "Activity assignments fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch activity assignments",
    );
  }
};

/**
 * Fetch all assignments created by a specific faculty member
 * @param {string} facultyId - Faculty identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with assignments
 */
exports.getByFacultyId = async (facultyId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { faculty: facultyId },
      options,
    );
    return response(
      false,
      assignments,
      "Faculty assignments fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch faculty assignments",
    );
  }
};

/**
 * Get all assignments for a specific academic course
 * @param {string} courseId - Course identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with assignments
 */
exports.getByCourseId = async (courseId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { course: courseId },
      options,
    );
    return response(
      false,
      assignments,
      "Course assignments fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch course assignments",
    );
  }
};

/**
 * Fetch all assignments for a specific student batch
 * @param {string} batchId - Batch identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with assignments
 */
exports.getByBatchId = async (batchId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { batch: batchId },
      options,
    );
    return response(
      false,
      assignments,
      "Batch assignments fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch batch assignments",
    );
  }
};
