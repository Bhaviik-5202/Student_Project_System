const dashboardService = require("../services/dashboardService");
const ApiError = require("../utils/ApiError");

// Get notifications for a user
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await dashboardService.getUserNotifications(
      req.params.userId,
    );
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch notifications", [err.message]),
    );
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await dashboardService.markAsRead(req.params.id);
    if (!notification) return next(new ApiError(404, "Notification not found"));
    return res.json({ success: true, data: notification });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to mark notification as read", [err.message]),
    );
  }
};

// Get recent activity for a user
exports.getUserActivity = async (req, res, next) => {
  try {
    const activity = await dashboardService.getUserActivity(req.params.userId);
    return res.json({ success: true, data: activity });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch user activity", [err.message]),
    );
  }
};

// Add notification
exports.addNotification = async (req, res, next) => {
  try {
    const notification = await dashboardService.addNotification(req.body);
    return res.status(201).json({ success: true, data: notification });
  } catch (err) {
    return next(new ApiError(400, "Failed to add notification", [err.message]));
  }
};

// Add activity
const Activity = require("../models/Activity");
exports.addActivity = async (req, res, next) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    return res.status(201).json({ success: true, data: activity });
  } catch (err) {
    return next(new ApiError(400, "Failed to add activity", [err.message]));
  }
};
