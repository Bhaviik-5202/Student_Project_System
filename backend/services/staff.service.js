const staffRepository = require('../repositories/staff.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Onboard a new staff member (Faculty/Admin)
 * @param {Object} data - Staff profile data
 * @returns {Promise<Object>} Formatted service response with new staff data
 */
exports.create = async (data) => {
  try {
    const staff = await staffRepository.create(data);
    return response(false, staff, 'Staff created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create staff');
  }
};

/**
 * Fetch all registered staff members
 * @returns {Promise<Object>} Formatted service response with staff list
 */
exports.getAll = async () => {
  try {
    const staff = await staffRepository.findAll();
    return response(false, staff, 'Staff fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch staff');
  }
};

/**
 * Retrieve a staff member's detailed profile by ID
 * @param {string} id - Staff member ID
 * @returns {Promise<Object>} Formatted service response with staff data
 */
exports.getById = async (id) => {
  try {
    const staff = await staffRepository.findById(id);
    if (!staff) return response(true, null, 'Staff not found');
    return response(false, staff, 'Staff fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch staff');
  }
};

/**
 * Modify staff profile or permissions
 * @param {string} id - Staff member ID
 * @param {Object} data - Updates to apply
 * @returns {Promise<Object>} Formatted service response with updated staff data
 */
exports.update = async (id, data) => {
  try {
    const staff = await staffRepository.update(id, data);
    if (!staff) return response(true, null, 'Staff not found');
    return response(false, staff, 'Staff updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update staff');
  }
};

/**
 * Offboard/Remove a staff member from the system
 * @param {string} id - Staff member ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const staff = await staffRepository.remove(id);
    if (!staff) return response(true, null, 'Staff not found');
    return response(false, null, 'Staff deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete staff');
  }
};
