/**
 * Portfolio Routes
 * Handles student portfolio management.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const portfolioController = require('../controllers/portfolio.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/portfolios
 * @desc    Create a new student portfolio
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['student']),
  [
    // Allow omitting `student` — controller will resolve from authenticated user
    body('student').optional().isString().withMessage('Student must be a string'),

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
  roleMiddleware(['admin', 'faculty', 'student']),
  portfolioController.getPortfolioByStudent
);

/**
 * @route   GET /api/v1/portfolios/me
 * @desc    Retrieve portfolio for authenticated student (convenience endpoint)
 * @access  Private (Authenticated Users)
 */
router.get('/me', authMiddleware, portfolioController.getMyPortfolio);

/**
 * @route   PUT /api/v1/portfolios/:id
 * @desc    Update an existing portfolio
 * @access  Private (Authenticated Users)
 */
// List portfolios (admin/faculty)
router.get('/', authMiddleware, roleMiddleware(['admin', 'faculty']), portfolioController.listPortfolios);

/**
 * @route   PUT /api/v1/portfolios/:id
 * @desc    Update an existing portfolio
 * @access  Private (Authenticated Users)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'faculty', 'student']),
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

// Get by ID
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'faculty', 'student']), portfolioController.getById);

// Delete
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'faculty', 'student']), portfolioController.deletePortfolio);

module.exports = router;
