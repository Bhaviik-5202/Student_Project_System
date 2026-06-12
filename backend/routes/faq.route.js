/**
 * FAQ Routes
 * Handles CRUD operations for FAQs.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const faqController = require('../controllers/faq.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/faqs
 * @desc    Create a new FAQ
 * @access  Private (Authenticated Users)
 */
router.post('/', authMiddleware, roleMiddleware(['admin']), faqController.createFAQ);

/**
 * @route   GET /api/v1/faqs
 * @desc    Retrieve all FAQs
 * @access  Private (Authenticated Users)
 */
router.get('/', authMiddleware, faqController.getAllFAQs);

/**
 * @route   GET /api/v1/faqs/:id
 * @desc    Retrieve a specific FAQ by ID
 * @access  Private (Authenticated Users)
 */
router.get('/:id', authMiddleware, faqController.getFAQById);

/**
 * @route   PUT /api/v1/faqs/:id
 * @desc    Update an existing FAQ
 * @access  Private (Authenticated Users)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  [
    body('question')
      .optional()
      .notEmpty()
      .withMessage('Question cannot be empty'),
    body('answer').optional().notEmpty().withMessage('Answer cannot be empty'),
  ],
  validateRequest,
  faqController.updateFAQ
);

/**
 * @route   DELETE /api/v1/faqs/:id
 * @desc    Delete a FAQ
 * @access  Private (Authenticated Users)
 */
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), faqController.deleteFAQ);

module.exports = router;
