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

module.exports = router;
