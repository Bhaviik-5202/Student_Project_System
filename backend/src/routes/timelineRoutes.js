const express = require("express");
const router = express.Router();
const timelineController = require("../controllers/timelineController");

// GET /api/timeline/:projectId
router.get("/:projectId", timelineController.getTimelineByProject);
// POST /api/timeline
router.post("/", timelineController.saveTimeline);

module.exports = router;
