const Evaluation = require('../models/evaluation.model');

/**
 * Find all evaluations matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of evaluations
 */
exports.findAll = (filter = {}, options = {}) =>
  Evaluation.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single evaluation by its unique identifier
 * @param {string} id - Evaluation ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Evaluation document or null
 */
exports.findById = (id, options = {}) =>
  Evaluation.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new evaluation record to the database
 * @param {Object} data - Evaluation data object
 * @returns {Promise<Object>} Created evaluation document
 */
exports.create = (data) => Evaluation.create(data);

/**
 * Update an existing evaluation record
 * @param {string} id - Evaluation ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated evaluation document
 */
exports.update = (id, data) =>
  Evaluation.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete an evaluation record from the database
 * @param {string} id - Evaluation ID
 * @returns {Promise<Object|null>} Deleted evaluation document
 */
exports.remove = (id) => Evaluation.findByIdAndDelete(id);

/**
 * Count all evaluations matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Evaluation.countDocuments(filter);
