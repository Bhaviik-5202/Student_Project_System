/**
 * Message Routes
 * Handles individual chat messages.
 */

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/messages
 * @desc    Send a new message
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  [
    body('chatId').isMongoId().withMessage('Valid chat ID is required'),
    body('content').notEmpty().withMessage('Message content is required'),
  ],
  validateRequest,
  messageController.sendMessage
);

/**
 * @route   GET /api/v1/messages/:chatId
 * @desc    Retrieve messages from a specific chat
 * @access  Private (Authenticated Users)
 */
router.get(
  '/:chatId',
  authMiddleware,
  [param('chatId').isMongoId().withMessage('Invalid Chat ID')],
  validateRequest,
  messageController.getMessagesByChat
);

/**
 * @route   DELETE /api/v1/messages/:messageId
 * @desc    Delete a message
 * @access  Private (Authenticated Users)
 */
router.delete(
  '/:messageId',
  authMiddleware,
  [param('messageId').isMongoId().withMessage('Invalid Message ID')],
  validateRequest,
  messageController.deleteMessage
);

module.exports = router;
