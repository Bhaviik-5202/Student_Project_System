// services/resource.service.js
const Resource = require("../models/resource.model");

/**
 * Create a new resource
 * @param {Object} data - Resource data
 * @returns {Promise<Object>} Created resource
 */
exports.createResource = async (data) => {
  const resource = new Resource(data);
  return await resource.save();
};

/**
 * Get all resources with pagination and filters
 * @param {Object} params - Pagination and filter params
 * @returns {Promise<Object>} Paginated resources
 */
exports.getAllResources = async ({ page = 1, limit = 10, filters = {} }) => {
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
};

/**
 * Get a resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<Object|null>} Resource or null
 */
exports.getResourceById = async (id) => {
  return await Resource.findById(id);
};

/**
 * Delete a resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<Object|null>} Deleted resource or null
 */
exports.deleteResource = async (id) => {
  return await Resource.findByIdAndDelete(id);
};
