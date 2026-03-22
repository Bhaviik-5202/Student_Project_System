const User = require('../models/user.model');

/**
 * Find all users matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of users
 */
exports.findAll = (filter = {}, options = {}) =>
  User.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Find a single user matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} User document or null
 */
exports.findOne = (filter = {}, options = {}) =>
  User.findOne(filter)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single user by its unique identifier
 * @param {string} id - User ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} User document or null
 */
exports.findById = (id, options = {}) =>
  User.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new user record to the database
 * @param {Object} data - User data object
 * @returns {Promise<Object>} Created user document
 */
exports.create = (data) => User.create(data);

/**
 * Update an existing user record
 * @param {string} id - User ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated user document
 */
exports.update = (id, data) =>
  User.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a user record from the database
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} Deleted user document
 */
exports.remove = (id) => User.findByIdAndDelete(id);

/**
 * Count all users matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => User.countDocuments(filter);

/**
 * Find a single user by their email address
 * @param {string} email - Email address
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} User document or null
 */
exports.findByEmail = (email, options = {}) =>
  User.findOne({ email })
    .populate(options.populate || '')
    .select(options.select || '');
