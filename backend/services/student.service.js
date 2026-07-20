/**
 * Student Service
 * Business logic layer for student-related operations.
 */
const studentRepository = require('../repositories/student.repository');
const projectRepository = require('../repositories/project.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Get student projects
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with owned projects list
 */
exports.getProjects = async (studentId) => {
  try {
    const projects = await projectRepository.findAll({ owner: studentId });
    return response(false, projects, 'Student projects fetched successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch student projects'
    );
  }
};

/**
 * Create student profile
 * @param {Object} data - Student attribute data
 * @returns {Promise<Object>} Formatted service response with newly created profile
 */
exports.create = async (data) => {
  try {
    const student = await studentRepository.create(data);
    return response(false, student, 'Student created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create student');
  }
};

/**
 * Fetch all students
 * @returns {Promise<Object>} Formatted service response with global student list
 */
exports.getAll = async () => {
  try {
    const students = await studentRepository.findAll();
    return response(false, students, 'Students fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch students');
  }
};

/**
 * Get detailed student profile by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Formatted service response with student data
 */
exports.getById = async (id) => {
  try {
    const student = await studentRepository.findById(id);
    if (!student) return response(true, null, 'Student not found');
    return response(false, student, 'Student fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch student');
  }
};

/**
 * Update student profile attributes
 * @param {string} id - Student ID
 * @param {Object} data - Updated attributes
 * @returns {Promise<Object>} Formatted service response with updated student
 */
exports.update = async (id, data) => {
  try {
    const student = await studentRepository.update(id, data);
    if (!student) return response(true, null, 'Student not found');
    return response(false, student, 'Student updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update student');
  }
};

/**
 * Remove student profile
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Formatted service response with deletion status
 */
exports.remove = async (id) => {
  try {
    const student = await studentRepository.remove(id);
    if (!student) return response(true, null, 'Student not found');
    return response(false, null, 'Student deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete student');
  }
};
