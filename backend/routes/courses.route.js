/**
 * Course Routes
 * ------------------------------------------------------------------
 * Handles course-related API endpoints.
 * Currently supports course creation.
 */

const express = require("express");
const router = express.Router();

// Controller
const coursesController = require("../controllers/courses.controller");

/**
 * @route   POST /api/v1/courses
 * @desc    Create a new course
 * @access  Public (Consider protecting with authentication middleware)
 */
router.post("/", coursesController.createCourse);

module.exports = router;
