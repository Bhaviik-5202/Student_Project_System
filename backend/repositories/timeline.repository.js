const Timeline = require('../models/timeline.model');

/**
 * Find all timeline events matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of timeline events
 */
exports.findAll = (filter = {}, options = {}) =>
  Timeline.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || 'project')
    .select(options.select || '');

/**
 * Locate a single timeline event by its unique identifier
 * @param {string} id - Timeline event ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Timeline event document or null
 */
exports.findById = (id, options = {}) =>
  Timeline.findById(id)
    .populate(options.populate || 'project')
    .select(options.select || '');

/**
 * Persist a new timeline event record to the database
 * @param {Object} data - Timeline event data object
 * @returns {Promise<Object>} Created timeline event document
 */
exports.create = (data) => Timeline.create(data);

/**
 * Update an existing timeline event record
 * @param {string} id - Timeline event ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated timeline event document
 */
exports.update = (id, data) =>
  Timeline.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a timeline event record from the database
 * @param {string} id - Timeline event ID
 * @returns {Promise<Object|null>} Deleted timeline event document
 */
exports.remove = (id) => Timeline.findByIdAndDelete(id);

/**
 * Count all timeline events matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Timeline.countDocuments(filter);

/**
 * Find all timeline events for a specific project
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} List of timeline events for the project
 */
exports.findByProjectId = (projectId) =>
  Timeline.find({ project: projectId })
    .populate('project')
    .sort({ dueDate: 1 });
