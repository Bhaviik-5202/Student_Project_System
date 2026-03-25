/**
 * Permission Service
 * Business logic layer for mapping and managing system permissions.
 */
const permissionRepository = require('../repositories/permission.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create permission
 * @param {Object} data - Permission data payload
 * @returns {Promise<Object>} Formatted service response with new permission entry
 */
exports.create = async (data) => {
  try {
    const permission = await permissionRepository.create(data);
    return response(false, permission, 'Permission created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create permission');
  }
};

/**
 * Fetch all registered system permissions
 * @returns {Promise<Object>} Formatted service response with permission list
 */
exports.getAll = async () => {
  try {
    const permissions = await permissionRepository.findAll();
    return response(false, permissions, 'Permissions fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch permissions');
  }
};

/**
 * Get permission by ID
 * @param {string} id - Permission identifier
 * @returns {Promise<Object>} Formatted service response with granular details
 */
exports.getById = async (id) => {
  try {
    const permission = await permissionRepository.findById(id);
    if (!permission) return response(true, null, 'Permission not found');
    return response(false, permission, 'Permission fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch permission');
  }
};

/**
 * Update permission attributes or mappings
 * @param {string} id - Permission identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated permission
 */
exports.update = async (id, data) => {
  try {
    const permission = await permissionRepository.update(id, data);
    if (!permission) return response(true, null, 'Permission not found');
    return response(false, permission, 'Permission updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update permission');
  }
};

/**
 * Delete permission
 * @param {string} id - Permission identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const permission = await permissionRepository.remove(id);
    if (!permission) return response(true, null, 'Permission not found');
    return response(false, null, 'Permission deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete permission');
  }
};
