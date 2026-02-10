const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");

// GET /api/meetings
router.get("/", meetingController.getAllMeetings);
// GET /api/meetings/:id
router.get("/:id", meetingController.getMeetingById);
// POST /api/meetings
router.post("/", meetingController.createMeeting);
// PUT /api/meetings/:id
router.put("/:id", meetingController.updateMeeting);
// DELETE /api/meetings/:id
router.delete("/:id", meetingController.deleteMeeting);
// POST /api/meetings/:id/join
router.post("/:id/join", meetingController.joinMeeting);

module.exports = router;
