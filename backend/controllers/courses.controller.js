const coursesService = require('../services/courses.service');
const sendResponse = require('../utils/response');

/**
 * Courses Controller
 * Manages academic courses, including creation, listing, and updates.
 */

/**
 * Create a new course
 * @route   POST /api/courses
 * @desc    Register a new academic course with title and description
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createCourse = async (req, res) => {
  try {
    const result = await coursesService.create(req.body);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Course created successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to create course',
        data: null,
        error: err.message,
      },
      500
    );
  }
};

/**
 * Fetch all courses
 * @route   GET /api/courses
 * @desc    Retrieve a list of all registered academic courses
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllCourses = async (req, res) => {
  try {
    const result = await coursesService.getAll();
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Courses fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch courses',
        data: null,
        error: err.message,
      },
      500
    );
  }
};

/**
 * Get detailed course info
 * @route   GET /api/courses/:id
 * @desc    Retrieve attributes and faculty details for a specific course
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCourseById = async (req, res) => {
  try {
    const result = await coursesService.getById(req.params.id);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Course fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch course',
        data: null,
        error: err.message,
      },
      500
    );
  }
};

/**
 * Update course details
 * @route   PUT /api/courses/:id
 * @desc    Modify course title, description, or faculty assignment
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateCourse = async (req, res) => {
  try {
    const result = await coursesService.update(req.params.id, req.body);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Course updated successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to update course',
        data: null,
        error: err.message,
      },
      500
    );
  }
};

/**
 * Remove a course record
 * @route   DELETE /api/courses/:id
 * @desc    Permanently delete a course and its student associations
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteCourse = async (req, res) => {
  try {
    const result = await coursesService.remove(req.params.id);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Course deleted successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to delete course',
        data: null,
        error: err.message,
      },
      500
    );
  }
};

/**
 * Enroll in a course
 * @route   POST /api/courses/:id/enroll
 * @desc    Register the authenticated student into a specific course
 * @access  Student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.id;
    const result = await coursesService.enroll(studentId, courseId);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : 'Enrolled in course successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to enroll in course',
        data: null,
        error: err.message,
      },
      500
    );
  }
};

/**
 * Fetch enrolled courses
 * @route   GET /api/courses/my
 * @desc    Retrieve all courses the current student is enrolled in
 * @access  Student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await coursesService.getEnrolled(studentId);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : 'My courses fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch my courses',
        data: null,
        error: err.message,
      },
      500
    );
  }
};
