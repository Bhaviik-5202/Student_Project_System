/**
 * Submission Service
 * Business logic layer for project and assignment submissions.
 */
const submissionRepository = require('../repositories/submission.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * File a new project/assignment submission
 * @param {Object} data - Submission payload
 * @returns {Promise<Object>} Formatted service response with new submission data
 */
exports.create = async (data) => {
  try {
    const submission = await submissionRepository.create(data);
    return response(false, submission, 'Submission filed successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create submission');
  }
};

/**
 * Fetch all submissions
 * @returns {Promise<Object>} Formatted service response with system-wide submissions
 */
exports.getAll = async () => {
  try {
    const submissions = await submissionRepository.findAll();
    return response(false, submissions, 'Submissions fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch submissions');
  }
};

/**
 * Get submission by ID
 * @param {string} id - Submission identifier
 * @returns {Promise<Object>} Formatted service response with full submission record
 */
exports.getById = async (id) => {
  try {
    const submission = await submissionRepository.findById(id);
    if (!submission) return response(true, null, 'Submission not found');
    return response(false, submission, 'Submission fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch submission');
  }
};

/**
 * Update submission record
 * @param {string} id - Submission identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified submission
 */
exports.update = async (id, data) => {
  try {
    const submission = await submissionRepository.update(id, data);
    if (!submission) return response(true, null, 'Submission not found');
    return response(false, submission, 'Submission updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update submission');
  }
};

/**
 * Delete submission record
 * @param {string} id - Submission identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const submission = await submissionRepository.remove(id);
    if (!submission) return response(true, null, 'Submission not found');
    return response(false, null, 'Submission deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete submission');
  }
};
/**
 * Get submissions by student
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with student submission history
 */
exports.getByStudentId = async (studentId) => {
  try {
    const submissions = await submissionRepository.findAll(
      { student: studentId },
      { populate: 'assignment' }
    );
    return response(false, submissions, 'Student history fetched successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch student history'
    );
  }
};
