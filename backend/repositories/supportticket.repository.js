const SupportTicket = require("../models/supportticket.model");

/**
 * Find all support tickets matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of support tickets
 */
exports.findAll = (filter = {}, options = {}) =>
  SupportTicket.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Locate a single support ticket by its unique identifier
 * @param {string} id - Support ticket ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Support ticket document or null
 */
exports.findById = (id, options = {}) =>
  SupportTicket.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Persist a new support ticket record to the database
 * @param {Object} data - Support ticket data object
 * @returns {Promise<Object>} Created support ticket document
 */
exports.create = (data) => SupportTicket.create(data);

/**
 * Update an existing support ticket record
 * @param {string} id - Support ticket ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated support ticket document
 */
exports.update = (id, data) =>
  SupportTicket.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a support ticket record from the database
 * @param {string} id - Support ticket ID
 * @returns {Promise<Object|null>} Deleted support ticket document
 */
exports.remove = (id) => SupportTicket.findByIdAndDelete(id);

/**
 * Count all support tickets matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => SupportTicket.countDocuments(filter);
