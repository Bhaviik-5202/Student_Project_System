const timelineRepository = require('../repositories/timeline.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Persist a new timeline event
 * @param {Object} data - Timeline event data payload
 * @returns {Promise<Object>} Formatted service response
 */
exports.create = async (data) => {
  try {
    const timeline = await timelineRepository.create(data);
    return response(false, timeline, 'Timeline created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create timeline');
  }
};

/**
 * Fetch all timeline events
 * @returns {Promise<Object>} Formatted service response with events list
 */
exports.getAll = async () => {
  try {
    const timelines = await timelineRepository.findAll();
    return response(false, timelines, 'Timelines fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch timelines');
  }
};

/**
 * Get detailed timeline event by ID
 * @param {string} id - Timeline identifier
 * @returns {Promise<Object>} Formatted service response with event data
 */
exports.getById = async (id) => {
  try {
    const timeline = await timelineRepository.findById(id);
    if (!timeline) return response(true, null, 'Timeline not found');
    return response(false, timeline, 'Timeline fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch timeline');
  }
};

/**
 * Update timeline event attributes or timing
 * @param {string} id - Timeline identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated event
 */
exports.update = async (id, data) => {
  try {
    const timeline = await timelineRepository.update(id, data);
    if (!timeline) return response(true, null, 'Timeline not found');
    return response(false, timeline, 'Timeline updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update timeline');
  }
};

/**
 * Delete a timeline event from the system
 * @param {string} id - Timeline identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const timeline = await timelineRepository.remove(id);
    if (!timeline) return response(true, null, 'Timeline not found');
    return response(false, null, 'Timeline deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete timeline');
  }
};

/**
 * Fetch all timeline events for a specific project
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Formatted service response with events list
 */
exports.getByProjectId = async (projectId) => {
  try {
    const timelines = await timelineRepository.findByProjectId(projectId);
    return response(
      false,
      timelines,
      'Project timeline events fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch project timeline events'
    );
  }
};
