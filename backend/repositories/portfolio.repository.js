const Portfolio = require("../models/portfolio.model");

/**
 * Find all portfolios matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of portfolios
 */
exports.findAll = (filter = {}, options = {}) =>
  Portfolio.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Find a single portfolio matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Portfolio document or null
 */
exports.findOne = (filter = {}, options = {}) =>
  Portfolio.findOne(filter)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Locate a single portfolio by its unique identifier
 * @param {string} id - Portfolio ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Portfolio document or null
 */
exports.findById = (id, options = {}) =>
  Portfolio.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Persist a new portfolio record to the database
 * @param {Object} data - Portfolio data object
 * @returns {Promise<Object>} Created portfolio document
 */
exports.create = (data) => Portfolio.create(data);

/**
 * Update an existing portfolio record
 * @param {string} id - Portfolio ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated portfolio document
 */
exports.update = (id, data) =>
  Portfolio.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a portfolio record from the database
 * @param {string} id - Portfolio ID
 * @returns {Promise<Object|null>} Deleted portfolio document
 */
exports.remove = (id) => Portfolio.findByIdAndDelete(id);

/**
 * Count all portfolios matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Portfolio.countDocuments(filter);
