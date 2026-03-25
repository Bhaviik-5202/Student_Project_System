/**
 * Course Repository
 * Data access layer for Course-related database operations.
 */
const Course = require('../models/courses.model');

/**
 * Find all courses matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of courses
 */
exports.findAll = (filter = {}, options = {}) =>
  Course.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || 'faculty', 'name email')
    .select(options.select || '');

/**
 * Locate a single course by its unique identifier
 * @param {string} id - Course ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Course document or null
 */
exports.findById = (id, options = {}) =>
  Course.findById(id)
    .populate(options.populate || 'faculty', 'name email')
    .select(options.select || '');

/**
 * Persist a new course record to the database
 * @param {Object} data - Course data object
 * @returns {Promise<Object>} Created course document
 */
exports.create = (data) => Course.create(data);

/**
 * Update an existing course record
 * @param {string} id - Course ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated course document
 */
exports.update = (id, data) =>
  Course.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a course record from the database
 * @param {string} id - Course ID
 * @returns {Promise<Object|null>} Deleted course document
 */
exports.remove = (id) => Course.findByIdAndDelete(id);

/**
 * Count all courses matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Course.countDocuments(filter);
