const { Notification, Activity } = require("../models/Dashboard");

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to mark as read", error: err.message });
  }
};

// Get recent activity for a user
exports.getUserActivity = async (req, res) => {
  try {
    const activity = await Activity.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activity);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch activity", error: err.message });
  }
};

// Add notification
exports.addNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to add notification", error: err.message });
  }
};

// Add activity
exports.addActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to add activity", error: err.message });
  }
};
