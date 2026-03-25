/**
 * Student Routes
 * Handles CRUD operations for students.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/students
 * @desc    Create a new student
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  [
    body('name').notEmpty().withMessage('Name is required'),

    body('email').isEmail().withMessage('Valid email is required'),

    body('rollNumber').notEmpty().withMessage('Roll number is required'),

    body('department').notEmpty().withMessage('Department is required'),

    body('year')
      .isInt({ min: 1 })
      .withMessage('Year must be a positive integer'),
  ],
  validateRequest,
  studentController.createStudent
);

/**
 * @route   GET /api/v1/students
 * @desc    Retrieve all students
 * @access  Private (Authenticated Users)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  studentController.getAllStudents
);

/**
 * @route   GET /api/v1/students/:id
 * @desc    Retrieve a student by ID
 * @access  Private (Authenticated Users)
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  studentController.getStudentById
);

/**
 * @route   PUT /api/v1/students/:id
 * @desc    Update an existing student
 * @access  Private (Authenticated Users)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),

    body('email').optional().isEmail().withMessage('Valid email is required'),

    body('rollNumber')
      .optional()
      .notEmpty()
      .withMessage('Roll number cannot be empty'),

    body('department')
      .optional()
      .notEmpty()
      .withMessage('Department cannot be empty'),

    body('year')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Year must be a positive integer'),
  ],
  validateRequest,
  studentController.updateStudent
);

/**
 * @route   DELETE /api/v1/students/:id
 * @desc    Delete a student
 * @access  Private (Authenticated Users)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  studentController.deleteStudent
);

module.exports = router;
