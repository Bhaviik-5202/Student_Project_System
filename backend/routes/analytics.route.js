/**
 * Analytics Routes
 * ------------------------------------------------------------------
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

router.get(
  '/grades',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  analyticsController.getGradeDistribution
);
router.get(
  '/performance',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  analyticsController.getPerformanceMetrics
);
router.get(
  '/progress',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  analyticsController.getProgressAnalytics
);
router.get(
  '/usage',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  analyticsController.getUsageStatistics
);

router.get(
  '/projects',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  analyticsController.getProjectAnalytics
);

router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  analyticsController.getUserAnalytics
);

module.exports = router;
