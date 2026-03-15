const coursesRepository = require("../repositories/courses.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Register a new academic course
 * @param {Object} data - Course creation data
 * @returns {Promise<Object>} Formatted service response with new course data
 */
exports.create = async (data) => {
  try {
    const course = await coursesRepository.create(data);
    return response(false, course, "Course created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create course");
  }
};

/**
 * Fetch all registered courses
 * @returns {Promise<Object>} Formatted service response with course list
 */
exports.getAll = async () => {
  try {
    const courses = await coursesRepository.findAll();
    return response(false, courses, "Courses fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch courses");
  }
};

/**
 * Get detailed information for a specific course by ID
 * @param {string} id - Course identifier
 * @returns {Promise<Object>} Formatted service response with course data
 */
exports.getById = async (id) => {
  try {
    const course = await coursesRepository.findById(id);
    if (!course) return response(true, null, "Course not found");
    return response(false, course, "Course fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch course");
  }
};

/**
 * Update course details or faculty assignment
 * @param {string} id - Course identifier
 * @param {Object} data - Updated attributes
 * @returns {Promise<Object>} Formatted service response with updated course
 */
exports.update = async (id, data) => {
  try {
    const course = await coursesRepository.update(id, data);
    if (!course) return response(true, null, "Course not found");
    return response(false, course, "Course updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update course");
  }
};

/**
 * Permanently remove a course from the system
 * @param {string} id - Course identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const course = await coursesRepository.remove(id);
    if (!course) return response(true, null, "Course not found");
    return response(false, null, "Course deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete course");
  }
};
