const express = require("express");
const router = express.Router();
const timelineController = require("../controllers/timeline.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, timelineController.createTimeline);
router.get("/", auth, timelineController.getAllTimelines);
router.get("/:id", auth, timelineController.getTimelineById);
router.put("/:id", auth, timelineController.updateTimeline);
router.delete("/:id", auth, timelineController.deleteTimeline);
module.exports = router;
