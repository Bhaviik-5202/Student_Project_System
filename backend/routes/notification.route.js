/**
 * Notification Routes
 * ------------------------------------------------------------------
 * Handles notification-related API endpoints.
 * Allows creating notifications, retrieving user notifications,
 * and marking notifications as read.
 * All routes are protected via authentication middleware.
 */

const express = require("express");
const router = express.Router();

// Controller
const notificationController = require("../controllers/notification.controller");

// Authentication Middleware
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @route   POST /api/v1/notifications
 * @desc    Create a new notification
 * @access  Private (Authenticated Users)
 */
router.post("/", authMiddleware, notificationController.createNotification);

/**
 * @route   GET /api/v1/notifications
 * @desc    Retrieve notifications for the authenticated user
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, notificationController.getNotifications);

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Mark a specific notification as read
 * @access  Private (Authenticated Users)
 */
router.patch("/:id/read", authMiddleware, notificationController.markAsRead);

module.exports = router;
