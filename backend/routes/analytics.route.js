/**
 * Analytics Routes
 * ------------------------------------------------------------------
 * Provides system analytics and dashboard statistics.
 * Primarily intended for administrative insights.
 */

const express = require("express");
const router = express.Router();

// Controller
const analyticsController = require("../controllers/analytics.controller");

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Retrieve admin dashboard statistics
 * @access  Private (Admin Only)
 */
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  analyticsController.getDashboardStats,
);

/**
 * @route   GET /api/v1/analytics/faculty-dashboard
 * @desc    Retrieve faculty dashboard statistics
 * @access  Private (Faculty Only)
 */
router.get(
  "/faculty-dashboard",
  authMiddleware,
  roleMiddleware(["faculty"]),
  analyticsController.getFacultyDashboardStats,
);

/**
 * @route   GET /api/v1/analytics/student-dashboard
 * @desc    Retrieve student dashboard statistics
 * @access  Private (Student Only)
 */
router.get(
  "/student-dashboard",
  authMiddleware,
  roleMiddleware(["student"]),
  analyticsController.getStudentDashboardStats,
);

module.exports = router;
