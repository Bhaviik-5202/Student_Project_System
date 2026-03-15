/**
 * Assignment Routes
 * ------------------------------------------------------------------
 * Handles all assignment-related API endpoints.
 */

const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

// Controllers and Middlewares
const assignmentController = require("../controllers/assignment.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * Validation rules for creating an assignment
 */
const createAssignmentValidation = [
  body("title").notEmpty().withMessage("Title is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Due date must be a valid ISO date"),
];

/**
 * Validation rules for updating an assignment
 */
const updateAssignmentValidation = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Due date must be a valid ISO date"),
];

/**
 * @route   POST /api/v1/assignments
 * @desc    Create a new assignment
 * @access  Private (Authenticated Users)
 */
router.post(
  "/",
  authMiddleware,
  createAssignmentValidation,
  assignmentController.createAssignment,
);

/**
 * @route   GET /api/v1/assignments
 * @desc    Retrieve all assignments
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, assignmentController.getAllAssignments);

/**
 * @route   GET /api/v1/assignments/:id
 * @desc    Retrieve a single assignment by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, assignmentController.getAssignmentById);

/**
 * @route   PUT /api/v1/assignments/:id
 * @desc    Update an existing assignment
 * @access  Private (Authenticated Users)
 */
router.put(
  "/:id",
  authMiddleware,
  updateAssignmentValidation,
  assignmentController.updateAssignment,
);

/**
 * @route   DELETE /api/v1/assignments/:id
 * @desc    Delete an assignment
 * @access  Private (Authenticated Users)
 */
router.delete("/:id", authMiddleware, assignmentController.deleteAssignment);

module.exports = router;
