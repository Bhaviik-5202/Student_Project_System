/**
 * Resource Service
 * Business logic layer for educational resource and file management.
 */
const resourceRepository = require('../repositories/resource.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Register educational resource
 * @param {Object} data - Resource metadata and links
 * @returns {Promise<Object>} Formatted service response with new resource document
 */
exports.create = async (data) => {
  try {
    const resource = await resourceRepository.create(data);
    return response(false, resource, 'Resource created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create resource');
  }
};

/**
 * Fetch all resources
 * @param {Object} params - Query and pagination parameters
 * @param {number} params.page - Target page number
 * @param {number} params.limit - Max records per page
 * @param {Object} params.filters - Filter conditions
 * @returns {Promise<Object>} Formatted service response with paginated resource data
 */
exports.getAll = async ({ page = 1, limit = 10, filters = {} } = {}) => {
  try {
    const skip = (page - 1) * limit;
    const [resources, total] = await Promise.all([
      resourceRepository.findAll(filters, {
        skip,
        limit,
        sort: { createdAt: -1 },
      }),
      resourceRepository.count(filters),
    ]);
    return response(
      false,
      {
        resources,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      'Resources fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch resources');
  }
};

/**
 * Get resource by ID
 * @param {string} id - Resource identifier
 * @returns {Promise<Object>} Formatted service response with specific resource metadata
 */
exports.getById = async (id) => {
  try {
    const resource = await resourceRepository.findById(id);
    if (!resource) return response(true, null, 'Resource not found');
    return response(false, resource, 'Resource fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch resource');
  }
};

/**
 * Delete resource record
 * @param {string} id - Resource identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const resource = await resourceRepository.remove(id);
    if (!resource) return response(true, null, 'Resource not found');
    return response(false, null, 'Resource deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete resource');
  }
};
