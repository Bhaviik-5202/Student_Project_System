const Notification = require("../models/notification.model");
const sendResponse = require("../utils/response");

/**
 * Mark a notification as read
 * @route PATCH /notifications/:id/read
 * @access Authenticated
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );

    if (!notification) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Notification not found",
          data: null,
          error: "Invalid notification ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Notification marked as read",
        data: notification,
        error: null,
      },
      200,
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
 * Create a new notification
 * @route POST /notifications
 * @access System, Admin
 */
exports.createNotification = async (req, res) => {
  try {
    const { user, message, type } = req.body;

    if (!user || !message) {
      return sendResponse(
        res,
        {
          success: false,
          message: "User and message are required",
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const notification = new Notification({ user, message, type });
    await notification.save();

    sendResponse(
      res,
      {
        success: true,
        message: "Notification created successfully",
        data: notification,
        error: null,
      },
      201,
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
 * Get notifications for a user
 * @route GET /notifications?user=:userId
 * @access Authenticated
 */
exports.getNotifications = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return sendResponse(
        res,
        {
          success: false,
          message: "User is required",
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const notifications = await Notification.find({ user }).sort({
      createdAt: -1,
    });

    sendResponse(
      res,
      {
        success: true,
        message: "Notifications fetched successfully",
        data: notifications,
        error: null,
      },
      200,
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
