const Permission = require('../models/permission.model');

/**
 * Find all permissions matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of permissions
 */
exports.findAll = (filter = {}, options = {}) =>
  Permission.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single permission by its unique identifier
 * @param {string} id - Permission ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Permission document or null
 */
exports.findById = (id, options = {}) =>
  Permission.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new permission record to the database
 * @param {Object} data - Permission data object
 * @returns {Promise<Object>} Created permission document
 */
exports.create = (data) => Permission.create(data);

/**
 * Update an existing permission record
 * @param {string} id - Permission ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated permission document
 */
exports.update = (id, data) =>
  Permission.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a permission record from the database
 * @param {string} id - Permission ID
 * @returns {Promise<Object|null>} Deleted permission document
 */
exports.remove = (id) => Permission.findByIdAndDelete(id);

/**
 * Count all permissions matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Permission.countDocuments(filter);
