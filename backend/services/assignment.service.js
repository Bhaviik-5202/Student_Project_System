const assignmentRepository = require("../repositories/assignment.repository");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Create a new assignment
 * @param {Object} data - Assignment data
 * @returns {Promise<Object>} Created assignment
 */
exports.create = async (data) => {
  try {
    const assignment = await assignmentRepository.create(data);
    return response(false, assignment, "Assignment created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create assignment");
  }
};

/**
 * Get all assignments with optional filters
 * @returns {Promise<Array>} List of assignments
 */
exports.getAll = async () => {
  try {
    const assignments = await assignmentRepository.findAll();
    return response(false, assignments, "Assignments fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch assignments");
  }
};

/**
 * Get an assignment by ID
 * @param {string} id - Assignment ID
 * @returns {Promise<Object|null>} Assignment or null
 */
exports.getById = async (id) => {
  try {
    const assignment = await assignmentRepository.findById(id);
    if (!assignment) return response(true, null, "Assignment not found");
    return response(false, assignment, "Assignment fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch assignment");
  }
};

/**
 * Update an assignment by ID
 * @param {string} id - Assignment ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated assignment or null
 */
exports.update = async (id, data) => {
  try {
    const assignment = await assignmentRepository.update(id, data);
    if (!assignment) return response(true, null, "Assignment not found");
    return response(false, assignment, "Assignment updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update assignment");
  }
};

/**
 * Delete an assignment by ID
 * @param {string} id - Assignment ID
 * @returns {Promise<Object|null>} Deleted assignment or null
 */
exports.remove = async (id) => {
  try {
    const assignment = await assignmentRepository.remove(id);
    if (!assignment) return response(true, null, "Assignment not found");
    return response(false, null, "Assignment deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete assignment");
  }
};
