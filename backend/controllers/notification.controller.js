const notificationService = require('../services/notification.service');
const sendResponse = require('../utils/response');

/**
 * Notification Controller
 * Manages system alerts, user notifications, and message broadcasts.
 */

/**
 * Create a new notification
 * @route   POST /api/notifications
 * @desc    Disseminate a new system alert or broadcast message
 * @access  Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createNotification = async (req, res) => {
  try {
    const result = await notificationService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : 'Notification created successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to create notification',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch user notifications
 * @route   GET /api/notifications
 * @desc    Retrieve a paginated list of notifications for the authenticated user
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await notificationService.getByUserId(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch notifications'
          : 'Notifications fetched successfully',
        data: result.data ? result.data.notifications : null,
        error: result.error || null,
        pagination: result.data
          ? {
            total: result.data.total,
            page: result.data.page,
            limit: result.data.limit,
            totalPages: result.data.pages,
          }
          : null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @desc    Update the read status of a specific notification
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Notification not found'
          : 'Notification marked as read',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Mark all notifications as read
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Bulk update all unread notifications for the current user
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : 'All notifications marked as read',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Delete a notification
 * @route   DELETE /api/notifications/:id
 * @desc    Permanently remove a notification entry
 * @access  Admin, Owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteNotification = async (req, res) => {
  try {
    const result = await notificationService.remove(req.params.id, req.user.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Notification not found'
          : 'Notification deleted successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Fetch unread notifications
 * @route   GET /api/notifications/unread
 * @desc    Retrieve only the notifications that have not been read yet
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUnreadNotifications = async (req, res) => {
  try {
    const result = await notificationService.getUnreadByUserId(req.user.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch unread notifications'
          : 'Unread notifications fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get notification by ID
 * @route   GET /api/notifications/:id
 * @desc    Retrieve detailed information for a specific notification
 * @access  Authenticated (Owner)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getNotificationById = async (req, res) => {
  try {
    const result = await notificationService.getById(
      req.params.id,
      req.user.id
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Notification not found'
          : 'Notification fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
