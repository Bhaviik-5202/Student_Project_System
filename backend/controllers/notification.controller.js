const mongoose = require("mongoose");
const Notification = require("../models/notification.model");
const sendResponse = require("../utils/response");

/**
 * Create Notification
 * @route   POST /api/v1/notifications
 * @access  Private (Admin/System recommended)
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

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid user ID",
          data: null,
          error: "Invalid ObjectId",
        },
        400,
      );
    }

    const notification = await Notification.create({
      user,
      message,
      type: type || "general",
    });

    return sendResponse(
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
    return sendResponse(
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
 * Get All Notifications (Pagination Supported)
 * @route   GET /api/v1/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ user: userId });

    return sendResponse(
      res,
      {
        success: true,
        message: "Notifications fetched successfully",
        data: {
          total,
          page,
          pages: Math.ceil(total / limit),
          notifications,
        },
        error: null,
      },
      200,
    );
  } catch (error) {
    return sendResponse(
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
 * Get Unread Notifications
 * @route   GET /api/v1/notifications/unread
 * @access  Private
 */
exports.getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({
      user: userId,
      read: false,
    }).sort({ createdAt: -1 });

    return sendResponse(
      res,
      {
        success: true,
        message: "Unread notifications fetched successfully",
        data: notifications,
        error: null,
      },
      200,
    );
  } catch (error) {
    return sendResponse(
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
 * Get Notification By ID
 * @route   GET /api/v1/notifications/:id
 * @access  Private
 */
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid notification ID",
          data: null,
          error: "Invalid ObjectId",
        },
        400,
      );
    }

    const notification = await Notification.findOne({
      _id: id,
      user: userId,
    });

    if (!notification) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Notification not found",
          data: null,
          error: "Not found",
        },
        404,
      );
    }

    return sendResponse(
      res,
      {
        success: true,
        message: "Notification fetched successfully",
        data: notification,
        error: null,
      },
      200,
    );
  } catch (error) {
    return sendResponse(
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
 * Mark Single Notification As Read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid notification ID",
          data: null,
          error: "Invalid ObjectId",
        },
        400,
      );
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
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
          error: "Not found",
        },
        404,
      );
    }

    return sendResponse(
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
    return sendResponse(
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
 * Mark All Notifications As Read
 * @route   PATCH /api/v1/notifications/mark-all-read
 * @access  Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, read: false },
      { read: true },
    );

    return sendResponse(
      res,
      {
        success: true,
        message: "All notifications marked as read",
        data: null,
        error: null,
      },
      200,
    );
  } catch (error) {
    return sendResponse(
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
 * Delete Notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid notification ID",
          data: null,
          error: "Invalid ObjectId",
        },
        400,
      );
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!notification) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Notification not found",
          data: null,
          error: "Not found",
        },
        404,
      );
    }

    return sendResponse(
      res,
      {
        success: true,
        message: "Notification deleted successfully",
        data: notification,
        error: null,
      },
      200,
    );
  } catch (error) {
    return sendResponse(
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
