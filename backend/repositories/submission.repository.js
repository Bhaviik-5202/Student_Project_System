const Submission = require("../models/submission.model");

/**
 * Find all submissions matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate)
 * @returns {Promise<Array>} List of submissions
 */
exports.findAll = (filter = {}, options = {}) =>
  Submission.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

/**
 * Locate a single submission by its unique identifier
 * @param {string} id - Submission ID
 * @param {Object} options - Query options (populate)
 * @returns {Promise<Object|null>} Submission document or null
 */
exports.findById = (id, options = {}) =>
  Submission.findById(id).populate(options.populate || "");

/**
 * Persist a new submission record to the database
 * @param {Object} data - Submission data object
 * @returns {Promise<Object>} Created submission document
 */
exports.create = (data) => Submission.create(data);

/**
 * Update an existing submission record
 * @param {string} id - Submission ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated submission document
 */
exports.update = (id, data) =>
  Submission.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

/**
 * Delete a submission record from the database
 * @param {string} id - Submission ID
 * @returns {Promise<Object|null>} Deleted submission document
 */
exports.remove = (id) => Submission.findByIdAndDelete(id);

/**
 * Count all submissions matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Submission.countDocuments(filter);
