const Resource = require("../models/resource.model");

/**
 * Create a new resource
 * @param {Object} data - Resource data
 * @returns {Promise<Object>} Created resource
 */
exports.createResource = async (data) => {
  try {
    const resource = new Resource(data);
    const savedResource = await resource.save();
    return savedResource;
  } catch (err) {
    throw new Error(err.message || "Failed to create resource");
  }
};

/**
 * Get all resources with pagination and filters
 * @param {Object} params - Pagination and filter params
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @param {Object} params.filters - Filter object
 * @returns {Promise<Object>} Paginated resources
 */
exports.getAllResources = async ({ page = 1, limit = 10, filters = {} }) => {
  try {
    const skip = (page - 1) * limit;
    const [resources, total] = await Promise.all([
      Resource.find(filters).skip(skip).limit(limit),
      Resource.countDocuments(filters),
    ]);
    return {
      resources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (err) {
    throw new Error(err.message || "Failed to fetch resources");
  }
};

/**
 * Get a resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<Object|null>} Resource or null
 */
exports.getResourceById = async (id) => {
  try {
    return await Resource.findById(id);
  } catch (err) {
    throw new Error(err.message || "Failed to fetch resource");
  }
};

/**
 * Delete a resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<Object|null>} Deleted resource or null
 */
exports.deleteResource = async (id) => {
  try {
    return await Resource.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err.message || "Failed to delete resource");
  }
};
