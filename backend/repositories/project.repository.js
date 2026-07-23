/**
 * Project Repository
 * Handles direct database access and core project lifecycle management for the Project model.
 */
const Project = require('../models/project.model');

/**
 * Find all projects matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of projects
 */
exports.findAll = (filter = {}, options = {}) => {
  let query = Project.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

  if (options.lean) query = query.lean();
  return query;
};

/**
 * Locate a single project by its unique identifier
 * @param {string} id - Project ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Project document or null
 */
exports.findById = (id, options = {}) => {
  let query = Project.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

  if (options.lean) query = query.lean();
  return query;
};

/**
 * Locate a single project by arbitrary criteria
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Project document or null
 */
exports.findOne = (filter, options = {}) => {
  let query = Project.findOne(filter)
    .populate(options.populate || '')
    .select(options.select || '');

  if (options.lean) query = query.lean();
  return query;
};

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
exports.update = (id, data) => {
  // Wrap in $set so runValidators only validates provided fields,
  // preventing spurious "field is required" errors on partial updates
  // (e.g. assigning only a guide without sending type/title).
  const updateOp = data.$set || data.$addToSet ? data : { $set: data };
  return Project.findByIdAndUpdate(id, updateOp, {
    returnDocument: 'after',
    runValidators: true,
  });
};

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
