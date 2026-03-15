/**
 * Meeting Routes
 * ------------------------------------------------------------------
 * Handles meeting-related API endpoints.
 */

const express = require("express");
const router = express.Router();

// Controllers and Middlewares
const meetingController = require("../controllers/meeting.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @route   POST /api/v1/meetings
 * @desc    Create a new meeting
 * @access  Private (Authenticated Users)
 */
router.post("/", authMiddleware, meetingController.createMeeting);

/**
 * @route   GET /api/v1/meetings
 * @desc    Get all meetings
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, meetingController.getAllMeetings);

/**
 * @route   GET /api/v1/meetings/:id
 * @desc    Get meeting by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, meetingController.getMeetingById);

/**
 * @route   POST /api/v1/meetings/:id/join
 * @desc    Join a meeting
 * @access  Private (Authenticated Users)
 */
router.post("/:id/join", authMiddleware, meetingController.joinMeeting);

/**
 * @route   PUT /api/v1/meetings/:id
 * @desc    Update a meeting
 * @access  Private (Authenticated Users)
 */
router.put("/:id", authMiddleware, meetingController.updateMeeting);

/**
 * @route   DELETE /api/v1/meetings/:id
 * @desc    Delete a meeting
 * @access  Private (Authenticated Users)
 */
router.delete("/:id", authMiddleware, meetingController.deleteMeeting);

module.exports = router;
