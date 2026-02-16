/**
 * Activity Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for activities.
 * All endpoints are protected via authentication middleware.
 */

const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activity.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @route   POST /api/activities
 * @desc    Create new activity
 * @access  Private
 */
router.post("/", authMiddleware, activityController.createActivity);

/**
 * @route   GET /api/activities
 * @desc    Get all activities
 * @access  Private
 */
router.get("/", authMiddleware, activityController.getAllActivities);

/**
 * @route   GET /api/activities/:id
 * @desc    Get single activity by ID
 * @access  Private
 */
router.get("/:id", authMiddleware, activityController.getActivityById);

/**
 * @route   PUT /api/activities/:id
 * @desc    Update activity by ID
 * @access  Private
 */
router.put("/:id", authMiddleware, activityController.updateActivity);

/**
 * @route   DELETE /api/activities/:id
 * @desc    Delete activity by ID
 * @access  Private
 */
router.delete("/:id", authMiddleware, activityController.deleteActivity);

module.exports = router;
