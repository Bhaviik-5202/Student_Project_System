const timelineRepository = require("../repositories/timeline.repository");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Create a new timeline event
 * @param {Object} data - Timeline data
 * @returns {Promise<Object>} Created timeline event
 */
exports.create = async (data) => {
  try {
    const timeline = await timelineRepository.create(data);
    return response(false, timeline, "Timeline created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create timeline");
  }
};

/**
 * Get all timeline events
 * @returns {Promise<Array>} List of timeline events
 */
exports.getAll = async () => {
  try {
    const timelines = await timelineRepository.findAll();
    return response(false, timelines, "Timelines fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch timelines");
  }
};

/**
 * Get a timeline event by ID
 * @param {string} id - Timeline ID
 * @returns {Promise<Object|null>} Timeline event or null
 */
exports.getById = async (id) => {
  try {
    const timeline = await timelineRepository.findById(id);
    if (!timeline) return response(true, null, "Timeline not found");
    return response(false, timeline, "Timeline fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch timeline");
  }
};

/**
 * Update a timeline event by ID
 * @param {string} id - Timeline ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated timeline event or null
 */
exports.update = async (id, data) => {
  try {
    const timeline = await timelineRepository.update(id, data);
    if (!timeline) return response(true, null, "Timeline not found");
    return response(false, timeline, "Timeline updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update timeline");
  }
};

/**
 * Delete a timeline event by ID
 * @param {string} id - Timeline ID
 * @returns {Promise<Object|null>} Deleted timeline event or null
 */
exports.remove = async (id) => {
  try {
    const timeline = await timelineRepository.remove(id);
    if (!timeline) return response(true, null, "Timeline not found");
    return response(false, null, "Timeline deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete timeline");
  }
};
