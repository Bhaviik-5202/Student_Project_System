/**
 * Resource Repository
 * Data access layer for Resource-related database operations.
 */
const Resource = require('../models/resource.model');

/**
 * Find all resources matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of resources
 */
exports.findAll = (filter = {}, options = {}) =>
  Resource.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single resource by its unique identifier
 * @param {string} id - Resource ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Resource document or null
 */
exports.findById = (id, options = {}) =>
  Resource.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new resource record to the database
 * @param {Object} data - Resource data object
 * @returns {Promise<Object>} Created resource document
 */
exports.create = (data) => Resource.create(data);

/**
 * Update an existing resource record
 * @param {string} id - Resource ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated resource document
 */
exports.update = (id, data) =>
  Resource.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a resource record from the database
 * @param {string} id - Resource ID
 * @returns {Promise<Object|null>} Deleted resource document
 */
exports.remove = (id) => Resource.findByIdAndDelete(id);

/**
 * Count all resources matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Resource.countDocuments(filter);
