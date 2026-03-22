const KnowledgeBase = require('../models/knowledgebase.model');

/**
 * Find all knowledge base articles matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of articles
 */
exports.findAll = (filter = {}, options = {}) =>
  KnowledgeBase.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single knowledge base article by its unique identifier
 * @param {string} id - Article ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Article document or null
 */
exports.findById = (id, options = {}) =>
  KnowledgeBase.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new knowledge base article record to the database
 * @param {Object} data - Article data object
 * @returns {Promise<Object>} Created article document
 */
exports.create = (data) => KnowledgeBase.create(data);

/**
 * Update an existing knowledge base article record
 * @param {string} id - Article ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated article document
 */
exports.update = (id, data) =>
  KnowledgeBase.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a knowledge base article record from the database
 * @param {string} id - Article ID
 * @returns {Promise<Object|null>} Deleted article document
 */
exports.remove = (id) => KnowledgeBase.findByIdAndDelete(id);

/**
 * Count all knowledge base articles matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => KnowledgeBase.countDocuments(filter);
