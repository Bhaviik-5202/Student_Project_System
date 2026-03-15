const settingRepository = require("../repositories/setting.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Persist a new system-wide preference or setting
 * @param {Object} data - Setting data payload
 * @returns {Promise<Object>} Formatted service response
 */
exports.create = async (data) => {
  try {
    const setting = await settingRepository.create(data);
    return response(false, setting, "Setting created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create setting");
  }
};

/**
 * Fetch all registered system settings
 * @returns {Promise<Object>} Formatted service response with settings list
 */
exports.getAll = async () => {
  try {
    const settings = await settingRepository.findAll();
    return response(false, settings, "Settings fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch settings");
  }
};

/**
 * Get detailed setting information by ID
 * @param {string} id - Setting identifier
 * @returns {Promise<Object>} Formatted service response with setting data
 */
exports.getById = async (id) => {
  try {
    const setting = await settingRepository.findById(id);
    if (!setting) return response(true, null, "Setting not found");
    return response(false, setting, "Setting fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch setting");
  }
};

/**
 * Update system preference or configuration
 * @param {string} id - Setting identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated setting
 */
exports.update = async (id, data) => {
  try {
    const setting = await settingRepository.update(id, data);
    if (!setting) return response(true, null, "Setting not found");
    return response(false, setting, "Setting updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update setting");
  }
};

/**
 * Delete a setting from the system
 * @param {string} id - Setting identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const setting = await settingRepository.remove(id);
    if (!setting) return response(true, null, "Setting not found");
    return response(false, null, "Setting deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete setting");
  }
};
