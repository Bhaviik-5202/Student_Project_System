/**
 * Evaluation Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for evaluations.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const evaluationController = require('../controllers/evaluation.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/evaluations
 * @desc    Create a new evaluation
 * @access  Private (Authenticated Users)
 */
router.post('/', authMiddleware, evaluationController.createEvaluation);

/**
 * @route   GET /api/v1/evaluations
 * @desc    Retrieve all evaluations
 * @access  Private (Authenticated Users)
 */
router.get('/', authMiddleware, evaluationController.getAllEvaluations);

/**
 * @route   GET /api/v1/evaluations/:id
 * @desc    Retrieve a specific evaluation by ID
 * @access  Private (Authenticated Users)
 */
router.get('/:id', authMiddleware, evaluationController.getEvaluationById);

/**
 * @route   PUT /api/v1/evaluations/:id
 * @desc    Update an existing evaluation
 * @access  Private (Authenticated Users)
 */
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description')
      .optional()
      .notEmpty()
      .withMessage('Description cannot be empty'),
  ],
  validateRequest,
  evaluationController.updateEvaluation
);

/**
 * @route   DELETE /api/v1/evaluations/:id
 * @desc    Delete an evaluation
 * @access  Private (Authenticated Users)
 */
router.delete('/:id', authMiddleware, evaluationController.deleteEvaluation);

module.exports = router;
