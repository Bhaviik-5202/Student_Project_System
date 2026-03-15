const Staff = require("../models/staff.model");

/**
 * Find all staff members matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of staff members
 */
exports.findAll = (filter = {}, options = {}) =>
  Staff.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Locate a single staff member by their unique identifier
 * @param {string} id - Staff ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Staff document or null
 */
exports.findById = (id, options = {}) =>
  Staff.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Persist a new staff record to the database
 * @param {Object} data - Staff data object
 * @returns {Promise<Object>} Created staff document
 */
exports.create = (data) => Staff.create(data);

/**
 * Update an existing staff record
 * @param {string} id - Staff ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated staff document
 */
exports.update = (id, data) =>
  Staff.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a staff record from the database
 * @param {string} id - Staff ID
 * @returns {Promise<Object|null>} Deleted staff document
 */
exports.remove = (id) => Staff.findByIdAndDelete(id);

/**
 * Count all staff members matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Staff.countDocuments(filter);
