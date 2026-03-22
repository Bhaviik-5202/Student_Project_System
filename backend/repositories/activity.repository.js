const Activity = require('../models/activity.model');

/**
 * Find all activities matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of activities
 */
exports.findAll = (filter = {}, options = {}) =>
  Activity.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single activity by its unique identifier
 * @param {string} id - Activity ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Activity document or null
 */
exports.findById = (id, options = {}) =>
  Activity.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new activity record to the database
 * @param {Object} data - Activity data object
 * @returns {Promise<Object>} Created activity document
 */
exports.create = (data) => Activity.create(data);

/**
 * Update an existing activity record
 * @param {string} id - Activity ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated activity document
 */
exports.update = (id, data) =>
  Activity.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete an activity record from the database
 * @param {string} id - Activity ID
 * @returns {Promise<Object|null>} Deleted activity document
 */
exports.remove = (id) => Activity.findByIdAndDelete(id);

/**
 * Count all activities matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Activity.countDocuments(filter);
