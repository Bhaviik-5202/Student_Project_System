const activityRepository = require("../repositories/activity.repository");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Create a new activity
 * @param {Object} data - Activity data
 * @returns {Promise<Object>} Created activity
 */
exports.create = async (data) => {
  try {
    const activity = await activityRepository.create(data);
    return response(false, activity, "Activity created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create activity");
  }
};

/**
 * Get all activities
 * @returns {Promise<Array>} List of activities
 */
exports.getAll = async () => {
  try {
    const activities = await activityRepository.findAll();
    return response(false, activities, "Activities fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch activities");
  }
};

/**
 * Get an activity by ID
 * @param {string} id - Activity ID
 * @returns {Promise<Object|null>} Activity or null
 */
exports.getById = async (id) => {
  try {
    const activity = await activityRepository.findById(id);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, activity, "Activity fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch activity");
  }
};

/**
 * Update an activity by ID
 * @param {string} id - Activity ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated activity or null
 */
exports.update = async (id, data) => {
  try {
    const activity = await activityRepository.update(id, data);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, activity, "Activity updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update activity");
  }
};

/**
 * Delete an activity by ID
 * @param {string} id - Activity ID
 * @returns {Promise<Object|null>} Deleted activity or null
 */
exports.remove = async (id) => {
  try {
    const activity = await activityRepository.remove(id);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, null, "Activity deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete activity");
  }
};
