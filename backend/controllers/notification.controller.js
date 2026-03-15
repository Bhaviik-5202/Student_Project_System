const notificationService = require("../services/notification.service");
const sendResponse = require("../utils/response");

/**
 * Notification Controller
 * Manages system alerts, user notifications, and message broadcasts.
 */

/**
 * Disseminate a new notification alert
 * @route POST /notifications
 * @access admin, faculty
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
          : "Notification created successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to create notification",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Fetch all notifications for the authenticated user
 * @route GET /notifications
 * @access Authenticated
 */
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await notificationService.getByUserId(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch notifications"
          : "Notifications fetched successfully",
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
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Mark a specific notification as read by the user
 * @route PUT /notifications/:id/read
 * @access Authenticated
 */
exports.markAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAsRead(
      req.params.id,
      req.user.id,
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Notification not found"
          : "Notification marked as read",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Bulk mark all unread notifications as read for current user
 * @route PUT /notifications/mark-all-read
 * @access Authenticated
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
          : "All notifications marked as read",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Terminate a notification entry
 * @route DELETE /notifications/:id
 * @access admin, user (own)
 */
exports.deleteNotification = async (req, res) => {
  try {
    const result = await notificationService.remove(req.params.id, req.user.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Notification not found"
          : "Notification deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
/**
 * Fetch only unread notifications for the user
 * @route GET /notifications/unread
 * @access Authenticated
 */
exports.getUnreadNotifications = async (req, res) => {
  try {
    const result = await notificationService.getUnreadByUserId(req.user.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch unread notifications"
          : "Unread notifications fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Fetch specific notification details by ID
 * @route GET /notifications/:id
 * @access Authenticated (Owner)
 */
exports.getNotificationById = async (req, res) => {
  try {
    const result = await notificationService.getById(
      req.params.id,
      req.user.id,
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Notification not found"
          : "Notification fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
