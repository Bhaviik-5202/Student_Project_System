const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const auth = require("../middleware/auth.middleware");

// Create notification
router.post("/", auth, notificationController.createNotification);
// Get notifications for a user
router.get("/", auth, notificationController.getNotifications);
// Mark notification as read
router.patch("/:id/read", auth, notificationController.markAsRead);

module.exports = router;
