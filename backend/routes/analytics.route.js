const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const auth = require("../middleware/auth.middleware");

// GET /api/v1/analytics/dashboard - Admin dashboard stats
router.get("/dashboard", auth, analyticsController.getDashboardStats);

module.exports = router;
