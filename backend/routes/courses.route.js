/**
 * Course Routes
 * ------------------------------------------------------------------
 * Handles course-related API endpoints.
 */

const express = require('express');
const router = express.Router();

// Controllers and Middlewares
const coursesController = require('../controllers/courses.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/v1/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  coursesController.getAllCourses
);

/**
 * @route   GET /api/v1/courses/my
 * @desc    Get courses enrolled by the current student
 * @access  Private (Student/Admin)
 */
router.get(
  '/my',
  authMiddleware,
  roleMiddleware(['admin']),
  coursesController.getMyCourses
);

/**
 * @route   POST /api/v1/courses
 * @desc    Create a new course
 * @access  Private (Admin/Faculty)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  coursesController.createCourse
);

/**
 * @route   GET /api/v1/courses/:id
 * @desc    Get course by ID
 * @access  Public
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  coursesController.getCourseById
);

/**
 * @route   POST /api/v1/courses/:id/enroll
 * @desc    Enroll in a course
 * @access  Private (Student/Admin)
 */
router.post(
  '/:id/enroll',
  authMiddleware,
  roleMiddleware(['admin']),
  coursesController.enrollCourse
);

/**
 * @route   PUT /api/v1/courses/:id
 * @desc    Update a course
 * @access  Private (Admin/Faculty)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  coursesController.updateCourse
);

/**
 * @route   DELETE /api/v1/courses/:id
 * @desc    Delete a course
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  coursesController.deleteCourse
);

module.exports = router;
