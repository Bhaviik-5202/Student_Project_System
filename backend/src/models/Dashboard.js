const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  type: { type: String, default: "info" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  details: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  Notification: mongoose.model("Notification", notificationSchema),
  Activity: mongoose.model("Activity", activitySchema),
};
