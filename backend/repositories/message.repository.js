/**
 * Message Repository
 * Data access layer for Message-related database operations.
 */
const Message = require('../models/message.model');

/**
 * Find all messages matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of messages
 */
exports.findAll = (filter = {}, options = {}) =>
  Message.find(filter)
    .sort(options.sort || { createdAt: 1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single message by its unique identifier
 * @param {string} id - Message ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Message document or null
 */
exports.findById = (id, options = {}) =>
  Message.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new message record to the database
 * @param {Object} data - Message data object
 * @returns {Promise<Object>} Created message document
 */
exports.create = (data) => Message.create(data);

/**
 * Update an existing message record
 * @param {string} id - Message ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated message document
 */
exports.update = (id, data) =>
  Message.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a message record from the database
 * @param {string} id - Message ID
 * @returns {Promise<Object|null>} Deleted message document
 */
exports.remove = (id) => Message.findByIdAndDelete(id);

/**
 * Count all messages matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Message.countDocuments(filter);
