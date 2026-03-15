const activityRepository = require("../repositories/activity.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Persist a new activity record
 * @param {Object} data - Activity data payload
 * @returns {Promise<Object>} Formatted service response
 */
exports.create = async (data) => {
  try {
    const activity = await activityRepository.create(data);
    return response(false, activity, "Activity created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create activity");
  }
};

/**
 * Fetch all activities
 * @returns {Promise<Object>} Formatted service response with activity list
 */
exports.getAll = async () => {
  try {
    const activities = await activityRepository.findAll();
    return response(false, activities, "Activities fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch activities");
  }
};

/**
 * Get detailed activity by ID
 * @param {string} id - Activity ID
 * @returns {Promise<Object>} Formatted service response with activity data
 */
exports.getById = async (id) => {
  try {
    const activity = await activityRepository.findById(id);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, activity, "Activity fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch activity");
  }
};

/**
 * Update activity attributes
 * @param {string} id - Activity ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated activity
 */
exports.update = async (id, data) => {
  try {
    const activity = await activityRepository.update(id, data);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, activity, "Activity updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update activity");
  }
};

/**
 * Delete an activity from the system
 * @param {string} id - Activity ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const activity = await activityRepository.remove(id);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, null, "Activity deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete activity");
  }
};
