/**
 * Meeting Repository
 * Data access layer for Meeting-related database operations.
 */
const Meeting = require('../models/meeting.model');

/**
 * Find all meetings matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of meetings
 */
exports.findAll = (filter = {}, options = {}) =>
  Meeting.find(filter)
    .sort(options.sort || { date: 1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single meeting by its unique identifier
 * @param {string} id - Meeting ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Meeting document or null
 */
exports.findById = (id, options = {}) =>
  Meeting.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new meeting record to the database
 * @param {Object} data - Meeting data object
 * @returns {Promise<Object>} Created meeting document
 */
exports.create = (data) => Meeting.create(data);

/**
 * Update an existing meeting record
 * @param {string} id - Meeting ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated meeting document
 */
exports.update = (id, data) =>
  Meeting.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a meeting record from the database
 * @param {string} id - Meeting ID
 * @returns {Promise<Object|null>} Deleted meeting document
 */
exports.remove = (id) => Meeting.findByIdAndDelete(id);

/**
 * Count all meetings matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Meeting.countDocuments(filter);
