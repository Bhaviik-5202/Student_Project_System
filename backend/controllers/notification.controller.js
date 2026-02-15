const Notification = require("../models/notification.model");

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
      return res
        .status(404)
        .json({ error: true, data: null, message: "Notification not found" });
    }
    res.status(200).json({
      error: false,
      data: notification,
      message: "Notification marked as read",
    });
  } catch (err) {
    res.status(500).json({ error: true, data: null, message: err.message });
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
      return res.status(400).json({
        error: true,
        data: null,
        message: "User and message are required",
      });
    }
    const notification = new Notification({ user, message, type });
    await notification.save();
    res.status(201).json({
      error: false,
      data: notification,
      message: "Notification created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: true, data: null, message: err.message });
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
      return res
        .status(400)
        .json({ error: true, data: null, message: "User is required" });
    }
    const notifications = await Notification.find({ user }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      error: false,
      data: notifications,
      message: "Notifications fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ error: true, data: null, message: err.message });
  }
};
