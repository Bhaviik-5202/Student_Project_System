const express = require("express");
const router = express.Router();
const timelineController = require("../controllers/timelineController");

// GET all timelines
router.get("/", timelineController.getAllTimelines);
// GET timeline by project
router.get("/project/:projectId", timelineController.getTimelineByProject);
// POST create or update timeline
router.post("/", timelineController.saveTimeline);
// PATCH update timeline by id
router.patch("/:id", timelineController.updateTimeline);
// DELETE timeline by id
router.delete("/:id", timelineController.deleteTimeline);

module.exports = router;
