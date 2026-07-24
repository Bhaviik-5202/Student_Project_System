const studentService = require('../services/student.service');
const sendResponse = require('../utils/response');

/**
 * Student Controller
 * Manages comprehensive student profile data, academic records, and student-specific project associations.
 */

/**
 * Fetch all student profiles
 * @route   GET /api/students
 * @desc    Retrieve a list of all students with optional filters
 * @access  Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllStudents = async (req, res) => {
  try {
    const result = await studentService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch students'
          : 'Students fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get student by account ID
 * @route   GET /api/students/:id
 * @desc    Retrieve detailed profile data for a specific student instance
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStudentById = async (req, res) => {
  try {
    const result = await studentService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Student not found'
          : 'Student fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update student academic profile
 * @route   PUT /api/students/:id
 * @desc    Modify academic records or contact info for a student
 * @access  Admin, Student (own profile)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateStudent = async (req, res) => {
  try {
    const result = await studentService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Student not found'
          : 'Student updated successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Remove a student profile
 * @route   DELETE /api/students/:id
 * @desc    Permanently delete a student's academic and profile record
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteStudent = async (req, res) => {
  try {
    const result = await studentService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Student not found'
          : 'Student deleted successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Verify student existence
 * @route   GET /api/students/verify/:studentId
 * @desc    Lightweight check to confirm if a student ID is valid
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.verifyStudentId = async (req, res) => {
  try {
    const result = await studentService.getById(req.params.studentId);

    sendResponse(
      res,
      {
        success: !!result.data,
        message: result.data ? 'Student ID verified' : 'Student ID not found',
        data: { exists: !!result.data },
        error: null,
      },
      result.data ? 200 : 404
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Verification failed',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
