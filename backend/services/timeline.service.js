/**
 * Timeline Service
 * Business logic layer for project timeline events and activities.
 */
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
 * Create timeline event
 * @param {Object} data - Timeline event data payload
 * @returns {Promise<Object>} Formatted service response with new event entry
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
 * Get all timeline events
 * @returns {Promise<Object>} Formatted service response with global events list
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
 * Get timeline event by ID
 * @param {string} id - Timeline identifier
 * @returns {Promise<Object>} Formatted service response with detailed event data
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
 * Update timeline event
 * @param {string} id - Timeline identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified event data
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
 * Delete timeline event
 * @param {string} id - Timeline identifier
 * @returns {Promise<Object>} Formatted service response with removal status
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
 * Get timeline events by project
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Formatted service response with project-specific events
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
