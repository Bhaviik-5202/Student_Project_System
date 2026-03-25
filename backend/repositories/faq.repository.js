/**
 * FAQ Repository
 * Handles direct database access and administrative Q&A management for the FAQ model.
 */
const FAQ = require('../models/faq.model');

/**
 * Find all FAQs matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of FAQs
 */
exports.findAll = (filter = {}, options = {}) =>
  FAQ.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single FAQ by its unique identifier
 * @param {string} id - FAQ ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} FAQ document or null
 */
exports.findById = (id, options = {}) =>
  FAQ.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new FAQ record to the database
 * @param {Object} data - FAQ data object
 * @returns {Promise<Object>} Created FAQ document
 */
exports.create = (data) => FAQ.create(data);

/**
 * Update an existing FAQ record
 * @param {string} id - FAQ ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated FAQ document
 */
exports.update = (id, data) =>
  FAQ.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a FAQ record from the database
 * @param {string} id - FAQ ID
 * @returns {Promise<Object|null>} Deleted FAQ document
 */
exports.remove = (id) => FAQ.findByIdAndDelete(id);

/**
 * Count all FAQs matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => FAQ.countDocuments(filter);
