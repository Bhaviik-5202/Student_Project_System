/**
 * Assignment Repository
 * Data access layer for Assignment-related database operations.
 */
const Assignment = require('../models/assignment.model');

/**
 * Find all assignments matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of assignments
 */
exports.findAll = (filter = {}, options = {}) =>
  Assignment.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single assignment by its unique identifier
 * @param {string} id - Assignment ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Assignment document or null
 */
exports.findById = (id, options = {}) =>
  Assignment.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new assignment record to the database
 * @param {Object} data - Assignment data object
 * @returns {Promise<Object>} Created assignment document
 */
exports.create = (data) => Assignment.create(data);

/**
 * Update an existing assignment record
 * @param {string} id - Assignment ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated assignment document
 */
exports.update = (id, data) =>
  Assignment.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete an assignment record from the database
 * @param {string} id - Assignment ID
 * @returns {Promise<Object|null>} Deleted assignment document
 */
exports.remove = (id) => Assignment.findByIdAndDelete(id);

/**
 * Count all assignments matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Assignment.countDocuments(filter);
