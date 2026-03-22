const Setting = require('../models/setting.model');

/**
 * Find all settings matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of settings
 */
exports.findAll = (filter = {}, options = {}) =>
  Setting.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single setting by its unique identifier
 * @param {string} id - Setting ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Setting document or null
 */
exports.findById = (id, options = {}) =>
  Setting.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new setting record to the database
 * @param {Object} data - Setting data object
 * @returns {Promise<Object>} Created setting document
 */
exports.create = (data) => Setting.create(data);

/**
 * Update an existing setting record
 * @param {string} id - Setting ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated setting document
 */
exports.update = (id, data) =>
  Setting.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a setting record from the database
 * @param {string} id - Setting ID
 * @returns {Promise<Object|null>} Deleted setting document
 */
exports.remove = (id) => Setting.findByIdAndDelete(id);

/**
 * Count all settings matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Setting.countDocuments(filter);
