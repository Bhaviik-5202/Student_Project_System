/**
 * Notification Routes
 * ------------------------------------------------------------------
 * Handles notification-related API endpoints.
 * All routes are protected via authentication middleware.
 */

const express = require("express");
const router = express.Router();

// Controller
const notificationController = require("../controllers/notification.controller");

// Middleware
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

/**
 * @route   POST /api/v1/notifications
 * @desc    Create a new notification
 * @access  Private
 */
router.post("/", notificationController.createNotification);

/**
 * @route   GET /api/v1/notifications
 * @desc    Retrieve all notifications for authenticated user
 * @access  Private
 */
router.get("/", notificationController.getNotifications);

/**
 * @route   GET /api/v1/notifications/unread
 * @desc    Retrieve unread notifications
 * @access  Private
 */
router.get("/unread", notificationController.getUnreadNotifications);

/**
 * @route   GET /api/v1/notifications/:id
 * @desc    Retrieve notification by ID
 * @access  Private
 */
router.get("/:id", notificationController.getNotificationById);

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.patch("/:id/read", notificationController.markAsRead);

/**
 * @route   PATCH /api/v1/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch("/mark-all-read", notificationController.markAllAsRead);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
