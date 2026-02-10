const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// GET /api/analytics/grades
router.get("/grades", analyticsController.getGradeDistribution);
// GET /api/analytics/performance
router.get("/performance", analyticsController.getPerformanceMetrics);
// GET /api/analytics/usage
router.get("/usage", analyticsController.getUsageStatistics);

module.exports = router;
