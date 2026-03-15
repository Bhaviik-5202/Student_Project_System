const Course = require("../models/courses.model");

/**
 * Persist a new course record to the database
 * @param {Object} data - Course data object
 * @returns {Promise<Object>} Created course document
 */
exports.create = async (data) => {
  const course = new Course(data);
  return await course.save();
};

/**
 * Find all courses matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<Array>} List of courses
 */
exports.findAll = async (filter = {}) => {
  return await Course.find(filter).populate("faculty", "name email");
};

/**
 * Locate a single course by its unique identifier
 * @param {string} id - Course ID
 * @returns {Promise<Object|null>} Course document or null
 */
exports.findById = async (id) => {
  return await Course.findById(id).populate("faculty", "name email");
};

/**
 * Update an existing course record
 * @param {string} id - Course ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated course document
 */
exports.update = async (id, data) => {
  return await Course.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete a course record from the database
 * @param {string} id - Course ID
 * @returns {Promise<Object|null>} Deleted course document
 */
exports.remove = async (id) => {
  return await Course.findByIdAndDelete(id);
};

/**
 * Count all courses matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = async (filter = {}) => {
  return await Course.countDocuments(filter);
};
