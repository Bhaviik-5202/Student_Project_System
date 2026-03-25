/**
 * Assignment Service
 * Business logic layer for managing academic and project assignments.
 */
const assignmentRepository = require('../repositories/assignment.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create assignment
 * @param {Object} data - Assignment creation payload
 * @returns {Promise<Object>} Formatted service response with new assignment instance
 */
exports.create = async (data) => {
  try {
    const assignment = await assignmentRepository.create(data);
    return response(false, assignment, 'Assignment created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create assignment');
  }
};

/**
 * Fetch all assignments
 * @param {Object} options - Query and pagination options
 * @returns {Promise<Object>} Formatted service response with paginated assignment data
 */
exports.getAll = async (options = {}) => {
  try {
    const { page = 1, limit = 10, filters = {} } = options;
    const assignments = await assignmentRepository.findAll(filters, {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      populate: 'course',
    });
    return response(false, assignments, 'Assignments fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch assignments');
  }
};

/**
 * Get assignment by ID
 * @param {string} id - Assignment identifier
 * @returns {Promise<Object>} Formatted service response with populated assignment metadata
 */
exports.getById = async (id) => {
  try {
    const assignment = await assignmentRepository.findById(id, {
      populate: 'course',
    });
    if (!assignment) return response(true, null, 'Assignment not found');
    return response(false, assignment, 'Assignment fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch assignment');
  }
};

/**
 * Update assignment details
 * @param {string} id - Assignment identifier
 * @param {Object} data - Updated attribute data
 * @returns {Promise<Object>} Formatted service response with modified assignment data
 */
exports.update = async (id, data) => {
  try {
    const assignment = await assignmentRepository.update(id, data);
    if (!assignment) return response(true, null, 'Assignment not found');
    return response(false, assignment, 'Assignment updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update assignment');
  }
};

/**
 * Delete assignment record
 * @param {string} id - Assignment identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const assignment = await assignmentRepository.remove(id);
    if (!assignment) return response(true, null, 'Assignment not found');
    return response(false, null, 'Assignment deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete assignment');
  }
};

/**
 * Get student assignments
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with student task list
 */
exports.getByStudentId = async (studentId) => {
  try {
    const assignments = await assignmentRepository.findAll({
      student: studentId,
    });
    return response(
      false,
      assignments,
      'Student assignments fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch student assignments'
    );
  }
};

/**
 * Get activity assignments
 * @param {string} activityId - Activity identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with activity-linked tasks
 */
exports.getByActivityId = async (activityId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { activity: activityId },
      options
    );
    return response(
      false,
      assignments,
      'Activity assignments fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch activity assignments'
    );
  }
};

/**
 * Get faculty assignments
 * @param {string} facultyId - Faculty identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with faculty-created tasks
 */
exports.getByFacultyId = async (facultyId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { faculty: facultyId },
      options
    );
    return response(
      false,
      assignments,
      'Faculty assignments fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch faculty assignments'
    );
  }
};

/**
 * Get course assignments
 * @param {string} courseId - Course identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with curriculum tasks
 */
exports.getByCourseId = async (courseId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { course: courseId },
      options
    );
    return response(
      false,
      assignments,
      'Course assignments fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch course assignments'
    );
  }
};

/**
 * Get batch assignments
 * @param {string} batchId - Batch identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Formatted service response with batch-wide tasks
 */
exports.getByBatchId = async (batchId, options = {}) => {
  try {
    const assignments = await assignmentRepository.findAll(
      { batch: batchId },
      options
    );
    return response(
      false,
      assignments,
      'Batch assignments fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch batch assignments'
    );
  }
};
