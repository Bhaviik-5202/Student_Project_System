const studentRepository = require("../repositories/student.repository");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Create a new student
 * @param {Object} data - Student data
 * @returns {Promise<Object>} Created student
 */
exports.create = async (data) => {
  try {
    const student = await studentRepository.create(data);
    return response(false, student, "Student created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create student");
  }
};

/**
 * Get all students
 * @returns {Promise<Array>} List of students
 */
exports.getAll = async () => {
  try {
    const students = await studentRepository.findAll();
    return response(false, students, "Students fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch students");
  }
};

/**
 * Get a student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object|null>} Student or null
 */
exports.getById = async (id) => {
  try {
    const student = await studentRepository.findById(id);
    if (!student) return response(true, null, "Student not found");
    return response(false, student, "Student fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch student");
  }
};

/**
 * Update a student by ID
 * @param {string} id - Student ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated student or null
 */
exports.update = async (id, data) => {
  try {
    const student = await studentRepository.update(id, data);
    if (!student) return response(true, null, "Student not found");
    return response(false, student, "Student updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update student");
  }
};

/**
 * Delete a student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object|null>} Deleted student or null
 */
exports.remove = async (id) => {
  try {
    const student = await studentRepository.remove(id);
    if (!student) return response(true, null, "Student not found");
    return response(false, null, "Student deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete student");
  }
};
