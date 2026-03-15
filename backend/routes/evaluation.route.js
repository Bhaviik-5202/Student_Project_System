/**
 * Evaluation Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for evaluations.
 * All routes require authentication.
 */

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

// Controller
const evaluationController = require("../controllers/evaluation.controller");

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/evaluations
 * @desc    Create a new evaluation
 * @access  Private (Faculty, Admin)
 */
router.post("/", authMiddleware, evaluationController.createEvaluation);

/**
 * @route   GET /api/v1/evaluations
 * @desc    Retrieve all evaluations
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, evaluationController.getAllEvaluations);

/**
 * @route   GET /api/v1/evaluations/:id
 * @desc    Retrieve a specific evaluation by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, evaluationController.getEvaluationById);

/**
 * @route   PUT /api/v1/evaluations/:id
 * @desc    Update an existing evaluation
 * @access  Private (Faculty, Admin)
 */
router.put(
  "/:id",
  authMiddleware,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
  ],
  validateRequest,
  evaluationController.updateEvaluation
);

/**
 * @route   DELETE /api/v1/evaluations/:id
 * @desc    Delete an evaluation
 * @access  Private (Faculty, Admin)
 */
router.delete("/:id", authMiddleware, evaluationController.deleteEvaluation);

module.exports = router;