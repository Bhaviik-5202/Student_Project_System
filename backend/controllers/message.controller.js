const messageService = require('../services/message.service');
const sendResponse = require('../utils/response');

/**
 * Message Controller
 * Handles real-time messaging, chat history, and direct communication
 * between users.
 */

/**
 * Send a new message
 * @route   POST /api/messages
 * @desc    Transmit a direct or group message to participants
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendMessage = async (req, res) => {
  try {
    const result = await messageService.send(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Message sent successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to send message',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Fetch chat messages
 * @route   GET /api/messages/:chatId
 * @desc    Retrieve historical messages for a specific chat conversation
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMessagesByChat = async (req, res) => {
  try {
    const result = await messageService.getMessagesByChat(
      req.params.chatId,
      req.user.id
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch messages'
          : 'Messages fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Mark message as read
 * @route   PUT /api/messages/:id/read
 * @desc    Update the read status of a specific message
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAsRead = async (req, res) => {
  try {
    const result = await messageService.markAsRead(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Message not found' : 'Message marked as read',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Delete a message
 * @route   DELETE /api/messages/:id
 * @desc    Permanently remove a message from the conversation history
 * @access  Authenticated (Sender)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteMessage = async (req, res) => {
  try {
    const result = await messageService.deleteMessage(
      req.params.messageId,
      req.user.id
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Message deleted successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
