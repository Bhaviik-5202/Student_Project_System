const Notification = require("../models/notification.model");

/**
 * Find all notifications matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of notifications
 */
exports.findAll = (filter = {}, options = {}) =>
  Notification.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Locate a single notification by its unique identifier
 * @param {string} id - Notification ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Notification document or null
 */
exports.findById = (id, options = {}) =>
  Notification.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Persist a new notification record to the database
 * @param {Object} data - Notification data object
 * @returns {Promise<Object>} Created notification document
 */
exports.create = (data) => Notification.create(data);

/**
 * Update an existing notification record
 * @param {string} id - Notification ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated notification document
 */
exports.update = (id, data) =>
  Notification.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a notification record from the database
 * @param {string} id - Notification ID
 * @returns {Promise<Object|null>} Deleted notification document
 */
exports.remove = (id) => Notification.findByIdAndDelete(id);

/**
 * Count all notifications matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Notification.countDocuments(filter);
