const activityRepository = require('../repositories/activity.repository');
/**
 * Activity Service
 * Business logic layer for system and project activity logging.
 */

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create activity record
 * @param {Object} data - Activity data payload
 * @returns {Promise<Object>} Formatted service response with new activity entry
 */
exports.create = async (data) => {
  try {
    const activity = await activityRepository.create(data);
    return response(false, activity, 'Activity created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create activity');
  }
};

/**
 * Get all activities
 * @returns {Promise<Object>} Formatted service response with global activity logs
 */
exports.getAll = async () => {
  try {
    const activities = await activityRepository.findAll();
    return response(false, activities, 'Activities fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch activities');
  }
};

/**
 * Get activity by ID
 * @param {string} id - Activity identifier
 * @returns {Promise<Object>} Formatted service response with detailed activity data
 */
exports.getById = async (id) => {
  try {
    const activity = await activityRepository.findById(id);
    if (!activity) return response(true, null, 'Activity not found');
    return response(false, activity, 'Activity fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch activity');
  }
};

/**
 * Update activity
 * @param {string} id - Activity identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified activity data
 */
exports.update = async (id, data) => {
  try {
    const activity = await activityRepository.update(id, data);
    if (!activity) return response(true, null, 'Activity not found');
    return response(false, activity, 'Activity updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update activity');
  }
};

/**
 * Delete activity
 * @param {string} id - Activity identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const activity = await activityRepository.remove(id);
    if (!activity) return response(true, null, 'Activity not found');
    return response(false, null, 'Activity deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete activity');
  }
};
