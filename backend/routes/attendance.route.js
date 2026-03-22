/**
 * Attendance Routes
 * ------------------------------------------------------------------
 * Handles attendance management APIs.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * Validation rules for marking attendance
 */
const markAttendanceValidation = [
  body('student').notEmpty().withMessage('Student is required'),

  body('date')
    .notEmpty()
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date'),

  body('status')
    .notEmpty()
    .isIn(['present', 'absent', 'late', 'excused'])
    .withMessage('Status must be present, absent, late, or excused'),
];

/**
 * @route   POST /api/v1/attendance
 * @desc    Mark attendance for a student
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  markAttendanceValidation,
  validateRequest,
  attendanceController.markAttendance
);

/**
 * @route   GET /api/v1/attendance
 * @desc    Retrieve all attendance records
 * @access  Private (Authenticated Users)
 */
router.get('/', authMiddleware, attendanceController.getAllAttendance);

/**
 * @route   GET /api/v1/attendance/student/:studentId
 * @desc    Retrieve attendance records by student ID
 * @access  Private (Authenticated Users)
 */
router.get(
  '/student/:studentId',
  authMiddleware,
  attendanceController.getAttendanceByStudent
);

module.exports = router;
