/**
 * Analytics Routes
 * Provides system analytics and dashboard statistics.
 */

const express = require('express');
const router = express.Router();

// Controllers and Middlewares
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Retrieve admin dashboard statistics
 * @access  Private (Admin Only)
 */
router.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getDashboardStats
);

/**
 * @route   GET /api/v1/analytics/faculty-dashboard
 * @desc    Retrieve faculty dashboard statistics
 * @access  Private (Faculty Only)
 */
router.get(
  '/faculty-dashboard',
  authMiddleware,
  roleMiddleware(['faculty']),
  analyticsController.getFacultyDashboardStats
);

/**
 * @route   GET /api/v1/analytics/student-dashboard
 * @desc    Retrieve student dashboard statistics
 * @access  Private (Student Only)
 */
router.get(
  '/student-dashboard',
  authMiddleware,
  roleMiddleware(['student']),
  analyticsController.getStudentDashboardStats
);

/**
 * @route   GET /api/v1/analytics/grades
 * @desc    Retrieve grade distribution analytics
 * @access  Private (Admin Only)
 */
router.get(
  '/grades',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getGradeDistribution
);

/**
 * @route   GET /api/v1/analytics/reports
 * @desc    Retrieve dynamic reports analytics
 * @access  Private (Admin Only)
 */
router.get(
  '/reports',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getReportsAnalytics
);

/**
 * @route   GET /api/v1/analytics/performance
 * @desc    Retrieve performance metrics
 * @access  Private (Admin Only)
 */
router.get(
  '/performance',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getPerformanceMetrics
);

/**
 * @route   GET /api/v1/analytics/progress
 * @desc    Retrieve progress analytics
 * @access  Private (Admin Only)
 */
router.get(
  '/progress',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getProgressAnalytics
);

/**
 * @route   GET /api/v1/analytics/usage
 * @desc    Retrieve system usage statistics
 * @access  Private (Admin Only)
 */
router.get(
  '/usage',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getUsageStatistics
);

/**
 * @route   GET /api/v1/analytics/projects
 * @desc    Retrieve project analytics
 * @access  Private (Admin Only)
 */
router.get(
  '/projects',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getProjectAnalytics
);

/**
 * @route   GET /api/v1/analytics/users
 * @desc    Retrieve user analytics
 * @access  Private (Admin Only)
 */
router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getUserAnalytics
);

module.exports = router;
