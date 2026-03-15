const Project = require("../models/project.model");

/**
 * Find all projects matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of projects
 */
exports.findAll = (filter = {}, options = {}) =>
  Project.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Locate a single project by its unique identifier
 * @param {string} id - Project ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Project document or null
 */
exports.findById = (id, options = {}) =>
  Project.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Persist a new project record to the database
 * @param {Object} data - Project data object
 * @returns {Promise<Object>} Created project document
 */
exports.create = (data) => Project.create(data);

/**
 * Update an existing project record
 * @param {string} id - Project ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated project document
 */
exports.update = (id, data) =>
  Project.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

/**
 * Delete a project record from the database
 * @param {string} id - Project ID
 * @returns {Promise<Object|null>} Deleted project document
 */
exports.remove = (id) => Project.findByIdAndDelete(id);

/**
 * Count all projects matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Project.countDocuments(filter);
