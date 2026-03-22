const SharedFile = require('../models/sharedFile.model');

/**
 * Find all shared files matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of shared files
 */
exports.findAll = (filter = {}, options = {}) =>
  SharedFile.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single shared file by its unique identifier
 * @param {string} id - SharedFile ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} SharedFile document or null
 */
exports.findById = (id, options = {}) =>
  SharedFile.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new shared file record to the database
 * @param {Object} data - SharedFile data object
 * @returns {Promise<Object>} Created shared file document
 */
exports.create = (data) => SharedFile.create(data);

/**
 * Update an existing shared file record
 * @param {string} id - SharedFile ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated shared file document
 */
exports.update = (id, data) =>
  SharedFile.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

/**
 * Delete a shared file record from the database
 * @param {string} id - SharedFile ID
 * @returns {Promise<Object|null>} Deleted shared file document
 */
exports.remove = (id) => SharedFile.findByIdAndDelete(id);

/**
 * Count all shared files matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => SharedFile.countDocuments(filter);
