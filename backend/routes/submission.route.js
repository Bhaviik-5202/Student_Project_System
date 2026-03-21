/**
 * Submission Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for assignment submissions.
 */

const express = require("express");
const router = express.Router();

// Controllers and Middlewares
const submissionController = require("../controllers/submission.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../utils/upload");

/**
 * @route   POST /api/v1/submissions
 * @desc    Create a new submission
 * @access  Private (Authenticated Users)
 */
router.post("/", authMiddleware, upload.array("file"), submissionController.createSubmission);

/**
 * @route   GET /api/v1/submissions/history
 * @desc    Retrieve the current student's submission history
 * @access  Private (Student)
 */
router.get("/history", authMiddleware, submissionController.getSubmissionHistory);

/**
 * @route   GET /api/v1/submissions
 * @desc    Retrieve all submissions
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, submissionController.getAllSubmissions);

/**
 * @route   GET /api/v1/submissions/:id
 * @desc    Retrieve a specific submission by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, submissionController.getSubmissionById);

/**
 * @route   PUT /api/v1/submissions/:id
 * @desc    Update an existing submission
 * @access  Private (Authenticated Users)
 */
router.put("/:id", authMiddleware, submissionController.updateSubmission);

/**
 * @route   DELETE /api/v1/submissions/:id
 * @desc    Delete a submission
 * @access  Private (Authenticated Users)
 */
router.delete("/:id", authMiddleware, submissionController.deleteSubmission);

module.exports = router;
