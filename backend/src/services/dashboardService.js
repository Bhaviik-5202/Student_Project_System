const { Notification, Activity } = require("../models/Dashboard");

exports.getUserNotifications = async (userId) => {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
};

exports.markAsRead = async (id) => {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
};

exports.getUserActivity = async (userId) => {
  return Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
};

exports.addNotification = async (data) => {
  const notification = new Notification(data);
  return notification.save();
};

exports.addActivity = async (data) => {
  const activity = new Activity(data);
  return activity.save();
};
