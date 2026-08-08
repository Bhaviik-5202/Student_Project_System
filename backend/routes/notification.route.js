/**
 * Notification Routes
 * Handles notification-related API endpoints.
 */

const express = require('express');
const router = express.Router();

// Controllers and Middlewares
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all routes
router.use(authMiddleware);

/**
 * @route   POST /api/v1/notifications
 * @desc    Create a new notification
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  roleMiddleware(['admin', 'faculty']),
  notificationController.createNotification
);

/**
 * @route   GET /api/v1/notifications
 * @desc    Retrieve all notifications for authenticated user
 * @access  Private (Authenticated Users)
 */
router.get('/', notificationController.getNotifications);

/**
 * @route   GET /api/v1/notifications/unread
 * @desc    Retrieve unread notifications
 * @access  Private (Authenticated Users)
 */
router.get('/unread', notificationController.getUnreadNotifications);

/**
 * @route   GET /api/v1/notifications/:id
 * @desc    Retrieve notification by ID
 * @access  Private (Authenticated Users)
 */
router.get('/:id', notificationController.getNotificationById);

router.patch('/mark-all-read', notificationController.markAllAsRead);

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Authenticated Users)
 */
router.patch('/:id/read', notificationController.markAsRead);

/**
 * @route   DELETE /api/v1/notifications/clear-all
 * @desc    Clear all notifications for a user
 * @access  Private (Authenticated Users)
 */
router.delete('/clear-all', notificationController.clearAllNotifications);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete a notification
 * @access  Private (Authenticated Users)
 */
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
