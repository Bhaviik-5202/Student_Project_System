/**
 * Discussion Repository
 * Data access layer for Discussion-related database operations.
 */
const Discussion = require('../models/discussion.model');

/**
 * Find all discussions matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of discussions
 */
exports.findAll = (filter = {}, options = {}) =>
  Discussion.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single discussion by its unique identifier
 * @param {string} id - Discussion ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Discussion document or null
 */
exports.findById = (id, options = {}) =>
  Discussion.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new discussion record to the database
 * @param {Object} data - Discussion data object
 * @returns {Promise<Object>} Created discussion document
 */
exports.create = (data) => Discussion.create(data);

/**
 * Update an existing discussion record
 * @param {string} id - Discussion ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated discussion document
 */
exports.update = (id, data) =>
  Discussion.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

/**
 * Delete a discussion record from the database
 * @param {string} id - Discussion ID
 * @returns {Promise<Object|null>} Deleted discussion document
 */
exports.remove = (id) => Discussion.findByIdAndDelete(id);

/**
 * Count all discussions matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Discussion.countDocuments(filter);
