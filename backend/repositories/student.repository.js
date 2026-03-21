const Student = require("../models/student.model");

/**
 * Find all students matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of students
 */
exports.findAll = (filter = {}, options = {}) =>
  Student.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Locate a single student by their unique identifier
 * @param {string} id - Student ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Student document or null
 */
exports.findById = (id, options = {}) =>
  Student.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

/**
 * Persist a new student record to the database
 * @param {Object} data - Student data object
 * @returns {Promise<Object>} Created student document
 */
exports.create = (data) => Student.create(data);

/**
 * Update an existing student record
 * @param {string} id - Student ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated student document
 */
exports.update = (id, data) =>
  Student.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete a student record from the database
 * @param {string} id - Student ID
 * @returns {Promise<Object|null>} Deleted student document
 */
exports.remove = (id) => Student.findByIdAndDelete(id);

/**
 * Count all students matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => Student.countDocuments(filter);

/**
 * Locate a student by their email address
 * @param {string} email - Student email
 * @returns {Promise<Object|null>} Student document or null
 */
exports.findByEmail = (email) => Student.findOne({ email });
