const staffRepository = require("../repositories/staff.repository");

function response(error, data, message) {
  return { error, data, message };
}
F
/**
 * Create a new staff member
 * @param {Object} data - Staff data
 * @returns {Promise<Object>} Created staff member
 */
exports.create = async (data) => {
  try {
    const staff = await staffRepository.create(data);
    return response(false, staff, "Staff created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create staff");
  }
};

/**
 * Get all staff members
 * @returns {Promise<Array>} List of staff members
 */
exports.getAll = async () => {
  try {
    const staff = await staffRepository.findAll();
    return response(false, staff, "Staff fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch staff");
  }
};

/**
 * Get a staff member by ID
 * @param {string} id - Staff ID
 * @returns {Promise<Object|null>} Staff member or null
 */
exports.getById = async (id) => {
  try {
    const staff = await staffRepository.findById(id);
    if (!staff) return response(true, null, "Staff not found");
    return response(false, staff, "Staff fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch staff");
  }
};

/**
 * Update a staff member by ID
 * @param {string} id - Staff ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated staff member or null
 */
exports.update = async (id, data) => {
  try {
    const staff = await staffRepository.update(id, data);
    if (!staff) return response(true, null, "Staff not found");
    return response(false, staff, "Staff updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update staff");
  }
};

/**
 * Delete a staff member by ID
 * @param {string} id - Staff ID
 * @returns {Promise<Object|null>} Deleted staff member or null
 */
exports.remove = async (id) => {
  try {
    const staff = await staffRepository.remove(id);
    if (!staff) return response(true, null, "Staff not found");
    return response(false, null, "Staff deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete staff");
  }
};
