const Attendance = require('../models/attendance.model');

/**
 * Find all attendance records matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of attendance records
 */
exports.findAll = (filter = {}, options = {}) =>
  Attendance.find(filter)
    .sort(options.sort || { date: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single attendance record by its unique identifier
 * @param {string} id - Attendance ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Attendance document or null
 */
exports.findById = (id, options = {}) =>
  Attendance.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new attendance record to the database
 * @param {Object} data - Attendance data object
 * @returns {Promise<Object>} Created attendance document
 */
exports.create = (data) => Attendance.create(data);

/**
 * Update an existing attendance record
 * @param {string} id - Attendance ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated attendance document
 */
exports.update = (id, data) =>
  Attendance.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete an attendance record from the database
 * @param {string} id - Attendance ID
 * @returns {Promise<Object|null>} Deleted attendance document
 */
exports.remove = (id) => Attendance.findByIdAndDelete(id);

/**
 * Count all attendance records matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Attendance.countDocuments(filter);
