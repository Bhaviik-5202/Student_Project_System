/**
 * Support Ticket Routes
 * Handles CRUD operations for support tickets.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const supportTicketController = require('../controllers/supportticket.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/supporttickets
 * @desc    Create a new support ticket
 * @access  Private (Authenticated Users)
 */
router.post('/', authMiddleware, supportTicketController.createSupportTicket);

/**
 * @route   GET /api/v1/supporttickets
 * @desc    Retrieve all support tickets
 * @access  Private (Authenticated Users)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  supportTicketController.getAllSupportTickets
);

/**
 * @route   GET /api/v1/supporttickets/:id
 * @desc    Retrieve a specific support ticket by ID
 * @access  Private (Authenticated Users)
 */
router.get(
  '/:id',
  authMiddleware,
  supportTicketController.getSupportTicketById
);

/**
 * @route   PUT /api/v1/supporttickets/:id
 * @desc    Update an existing support ticket
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
  supportTicketController.updateSupportTicket
);

/**
 * @route   DELETE /api/v1/supporttickets/:id
 * @desc    Delete a support ticket
 * @access  Private (Authenticated Users)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  supportTicketController.deleteSupportTicket
);

module.exports = router;
