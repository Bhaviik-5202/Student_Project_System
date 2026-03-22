/**
 * Portfolio Routes
 * ------------------------------------------------------------------
 * Handles student portfolio management.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const portfolioController = require('../controllers/portfolio.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/portfolios
 * @desc    Create a new student portfolio
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  [
    body('student').notEmpty().withMessage('Student is required'),

    body('projects')
      .optional()
      .isArray()
      .withMessage('Projects must be an array'),

    body('skills').optional().isArray().withMessage('Skills must be an array'),

    body('badges').optional().isArray().withMessage('Badges must be an array'),

    body('transcriptUrl')
      .optional()
      .isString()
      .withMessage('Transcript URL must be a string'),
  ],
  validateRequest,
  portfolioController.createPortfolio
);

/**
 * @route   GET /api/v1/portfolios/student/:studentId
 * @desc    Retrieve portfolio by student ID
 * @access  Private (Authenticated Users)
 */
router.get(
  '/student/:studentId',
  authMiddleware,
  portfolioController.getPortfolioByStudent
);

/**
 * @route   PUT /api/v1/portfolios/:id
 * @desc    Update an existing portfolio
 * @access  Private (Authenticated Users)
 */
router.put(
  '/:id',
  authMiddleware,
  [
    body('projects')
      .optional()
      .isArray()
      .withMessage('Projects must be an array'),

    body('skills').optional().isArray().withMessage('Skills must be an array'),

    body('badges').optional().isArray().withMessage('Badges must be an array'),

    body('transcriptUrl')
      .optional()
      .isString()
      .withMessage('Transcript URL must be a string'),
  ],
  validateRequest,
  portfolioController.updatePortfolio
);

module.exports = router;
