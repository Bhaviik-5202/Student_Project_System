/**
 * Courses Service
 * Business logic layer for academic course management and enrollment.
 */
const coursesRepository = require('../repositories/courses.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Register academic course
 * @param {Object} data - Course creation data
 * @returns {Promise<Object>} Formatted service response with new course instance
 */
exports.create = async (data) => {
  try {
    const course = await coursesRepository.create(data);
    return response(false, course, 'Course created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create course');
  }
};

/**
 * Get all courses
 * @returns {Promise<Object>} Formatted service response with global course catalog
 */
exports.getAll = async () => {
  try {
    const courses = await coursesRepository.findAll();
    return response(false, courses, 'Courses fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch courses');
  }
};

/**
 * Get course by ID
 * @param {string} id - Course identifier
 * @returns {Promise<Object>} Formatted service response with specific course metadata
 */
exports.getById = async (id) => {
  try {
    const course = await coursesRepository.findById(id);
    if (!course) return response(true, null, 'Course not found');
    return response(false, course, 'Course fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch course');
  }
};

/**
 * Update course details
 * @param {string} id - Course identifier
 * @param {Object} data - Updated attributes
 * @returns {Promise<Object>} Formatted service response with modified course data
 */
exports.update = async (id, data) => {
  try {
    const course = await coursesRepository.update(id, data);
    if (!course) return response(true, null, 'Course not found');
    return response(false, course, 'Course updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update course');
  }
};

/**
 * Remove course record
 * @param {string} id - Course identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const course = await coursesRepository.remove(id);
    if (!course) return response(true, null, 'Course not found');
    return response(false, null, 'Course deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete course');
  }
};

/**
 * Enroll student in course
 * @param {string} userId - User identifier
 * @param {string} courseId - Course identifier
 * @returns {Promise<Object>} Formatted service response with updated student profile
 */
exports.enroll = async (userId, courseId) => {
  try {
    const studentRepository = require('../repositories/student.repository');
    const userRepository = require('../repositories/user.repository');

    // 1. Resolve User to get email
    const user = await userRepository.findById(userId);
    if (!user) return response(true, null, 'User account not found');

    // 2. Resolve Student by email
    let student = await studentRepository.findByEmail(user.email);

    // 3. If student profile doesn't exist, create it on-the-fly (for legacy users)
    if (!student) {
      student = await studentRepository.create({
        name: user.name,
        email: user.email,
        rollNumber: `STUDENT-${Date.now()}`,
        department: 'General',
        year: 1,
      });
    }

    const course = await coursesRepository.findById(courseId);
    if (!course) return response(true, null, 'Course not found');

    const updatedStudent = await studentRepository.update(student._id, {
      $addToSet: { enrolledCourses: courseId },
    });

    return response(false, updatedStudent, 'Enrolled in course successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to enroll in course');
  }
};

/**
 * Get enrolled courses
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} Formatted service response with student's course list
 */
exports.getEnrolled = async (userId) => {
  try {
    const studentRepository = require('../repositories/student.repository');
    const userRepository = require('../repositories/user.repository');

    // 1. Resolve User to get email
    const user = await userRepository.findById(userId);
    if (!user) return response(true, null, 'User account not found');

    // 2. Resolve Student by email
    let student = await studentRepository.findByEmail(user.email);

    // 3. Fallback for legacy users
    if (!student) {
      student = await studentRepository.create({
        name: user.name,
        email: user.email,
        rollNumber: `STUDENT-${Date.now()}`,
        department: 'General',
        year: 1,
      });
    }

    const fullStudent = await studentRepository.findById(student._id, {
      populate: 'enrolledCourses',
    });
    return response(
      false,
      fullStudent.enrolledCourses,
      'Enrolled courses fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch enrolled courses'
    );
  }
};
