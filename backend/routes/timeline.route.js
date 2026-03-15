/**
 * Timeline Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for timelines.
 */

const express = require("express");
const router = express.Router();

// Controllers and Middlewares
const timelineController = require("../controllers/timeline.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @route   POST /api/v1/timelines
 * @desc    Create a new timeline
 * @access  Private (Authenticated Users)
 */
router.post("/", authMiddleware, timelineController.createTimeline);

/**
 * @route   GET /api/v1/timelines
 * @desc    Retrieve all timelines
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, timelineController.getAllTimelines);

/**
 * @route   GET /api/v1/timelines/:id
 * @desc    Retrieve a specific timeline by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, timelineController.getTimelineById);

/**
 * @route   PUT /api/v1/timelines/:id
 * @desc    Update an existing timeline
 * @access  Private (Authenticated Users)
 */
router.put("/:id", authMiddleware, timelineController.updateTimeline);

/**
 * @route   DELETE /api/v1/timelines/:id
 * @desc    Delete a timeline
 * @access  Private (Authenticated Users)
 */
router.delete("/:id", authMiddleware, timelineController.deleteTimeline);

module.exports = router;
