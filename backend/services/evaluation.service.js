const evaluationRepository = require("../repositories/evaluation.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Persist a new project evaluation
 * @param {Object} data - Evaluation data payload
 * @returns {Promise<Object>} Formatted service response
 */
exports.create = async (data) => {
  try {
    const evaluation = await evaluationRepository.create(data);
    return response(false, evaluation, "Evaluation created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create evaluation");
  }
};

/**
 * Fetch all project evaluations
 * @returns {Promise<Object>} Formatted service response with evaluation list
 */
exports.getAll = async () => {
  try {
    const evaluations = await evaluationRepository.findAll();
    return response(false, evaluations, "Evaluations fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch evaluations");
  }
};

/**
 * Get detailed evaluation information by ID
 * @param {string} id - Evaluation identifier
 * @returns {Promise<Object>} Formatted service response with evaluation data
 */
exports.getById = async (id) => {
  try {
    const evaluation = await evaluationRepository.findById(id);
    if (!evaluation) return response(true, null, "Evaluation not found");
    return response(false, evaluation, "Evaluation fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch evaluation");
  }
};

/**
 * Update evaluation scores or feedback
 * @param {string} id - Evaluation identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated evaluation
 */
exports.update = async (id, data) => {
  try {
    const evaluation = await evaluationRepository.update(id, data);
    if (!evaluation) return response(true, null, "Evaluation not found");
    return response(false, evaluation, "Evaluation updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update evaluation");
  }
};

/**
 * Delete an evaluation from the system
 * @param {string} id - Evaluation identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const evaluation = await evaluationRepository.remove(id);
    if (!evaluation) return response(true, null, "Evaluation not found");
    return response(false, null, "Evaluation deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete evaluation");
  }
};
