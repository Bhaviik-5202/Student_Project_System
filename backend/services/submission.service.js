const submissionRepository = require("../repositories/submission.repository");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Create a new submission
 * @param {Object} data - Submission data
 * @returns {Promise<Object>} Created submission
 */
exports.create = async (data) => {
  try {
    const submission = await submissionRepository.create(data);
    return response(false, submission, "Submission created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create submission");
  }
};

/**
 * Get all submissions
 * @returns {Promise<Array>} List of submissions
 */
exports.getAll = async () => {
  try {
    const submissions = await submissionRepository.findAll();
    return response(false, submissions, "Submissions fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch submissions");
  }
};

/**
 * Get a submission by ID
 * @param {string} id - Submission ID
 * @returns {Promise<Object|null>} Submission or null
 */
exports.getById = async (id) => {
  try {
    const submission = await submissionRepository.findById(id);
    if (!submission) return response(true, null, "Submission not found");
    return response(false, submission, "Submission fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch submission");
  }
};

/**
 * Update a submission by ID
 * @param {string} id - Submission ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated submission or null
 */
exports.update = async (id, data) => {
  try {
    const submission = await submissionRepository.update(id, data);
    if (!submission) return response(true, null, "Submission not found");
    return response(false, submission, "Submission updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update submission");
  }
};

/**
 * Delete a submission by ID
 * @param {string} id - Submission ID
 * @returns {Promise<Object|null>} Deleted submission or null
 */
exports.remove = async (id) => {
  try {
    const submission = await submissionRepository.remove(id);
    if (!submission) return response(true, null, "Submission not found");
    return response(false, null, "Submission deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete submission");
  }
};
