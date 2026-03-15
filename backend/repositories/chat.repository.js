const Chat = require("../models/chat.model");

/**
 * Find all chats matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of chats
 */
exports.findAll = (filter = {}, options = {}) =>
  Chat.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Locate a single chat by its unique identifier
 * @param {string} id - Chat ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Chat document or null
 */
exports.findById = (id, options = {}) =>
  Chat.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Persist a new chat record to the database
 * @param {Object} data - Chat data object
 * @returns {Promise<Object>} Created chat document
 */
exports.create = (data) => Chat.create(data);

/**
 * Update an existing chat record
 * @param {string} id - Chat ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated chat document
 */
exports.update = (id, data) =>
  Chat.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a chat record from the database
 * @param {string} id - Chat ID
 * @returns {Promise<Object|null>} Deleted chat document
 */
exports.remove = (id) => Chat.findByIdAndDelete(id);

/**
 * Count all chats matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Chat.countDocuments(filter);
