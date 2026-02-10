const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/notifications/:userId
router.get("/notifications/:userId", dashboardController.getUserNotifications);
// PATCH /api/dashboard/notifications/:id/read
router.patch("/notifications/:id/read", dashboardController.markAsRead);
// GET /api/dashboard/activity/:userId
router.get("/activity/:userId", dashboardController.getUserActivity);
// POST /api/dashboard/notifications
router.post("/notifications", dashboardController.addNotification);
// POST /api/dashboard/activity
router.post("/activity", dashboardController.addActivity);

module.exports = router;
