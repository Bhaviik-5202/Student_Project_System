/**
 * Course Routes
 * ------------------------------------------------------------------
 * Handles course-related API endpoints.
 */

const express = require("express");
const router = express.Router();

// Controllers and Middlewares
const coursesController = require("../controllers/courses.controller");

/**
 * @route   GET /api/v1/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get("/", coursesController.getAllCourses);

/**
 * @route   POST /api/v1/courses
 * @desc    Create a new course
 * @access  Public
 */
router.post("/", coursesController.createCourse);

/**
 * @route   GET /api/v1/courses/:id
 * @desc    Get course by ID
 * @access  Public
 */
router.get("/:id", coursesController.getCourseById);

/**
 * @route   PUT /api/v1/courses/:id
 * @desc    Update a course
 * @access  Public
 */
router.put("/:id", coursesController.updateCourse);

/**
 * @route   DELETE /api/v1/courses/:id
 * @desc    Delete a course
 * @access  Public
 */
router.delete("/:id", coursesController.deleteCourse);

module.exports = router;
