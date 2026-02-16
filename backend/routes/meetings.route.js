/**
 * Meeting Routes
 * ------------------------------------------------------------------
 * Handles meeting-related API endpoints.
 */

const express = require("express");
const router = express.Router();

// Controller
const meetingController = require("../controllers/meeting.controller");

/**
 * @route   POST /api/v1/meetings
 * @desc    Create a new meeting
 * @access  Faculty, Admin
 */
router.post("/", meetingController.createMeeting);

/**
 * @route   GET /api/v1/meetings
 * @desc    Get all meetings
 * @access  Authenticated
 */
router.get("/", meetingController.getAllMeetings);

/**
 * @route   GET /api/v1/meetings/:id
 * @desc    Get meeting by ID
 * @access  Authenticated
 */
router.get("/:id", meetingController.getMeetingById);

/**
 * @route   POST /api/v1/meetings/:id/join
 * @desc    Join a meeting
 * @access  Authenticated
 */
router.post("/:id/join", meetingController.joinMeeting);

/**
 * @route   PUT /api/v1/meetings/:id
 * @desc    Update a meeting
 * @access  Faculty, Admin
 */
router.put("/:id", meetingController.updateMeeting);

/**
 * @route   DELETE /api/v1/meetings/:id
 * @desc    Delete a meeting
 * @access  Faculty, Admin
 */
router.delete("/:id", meetingController.deleteMeeting);

module.exports = router;
