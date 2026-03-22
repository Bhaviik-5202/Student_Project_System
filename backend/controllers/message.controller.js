const messageService = require('../services/message.service');
const sendResponse = require('../utils/response');

/**
 * Message Controller
 * Handles real-time messaging, chat history, and direct communication
 * between users.
 */

/**
 * Send a new direct or group message
 * @route POST /messages
 * @access Authenticated
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
 * Fetch chat history for an authenticated user
 * @route GET /messages/:chatId
 * @access Authenticated
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
 * Mark a specific message as read
 * @route PUT /messages/:id/read
 * @access Authenticated
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
 * Remove a specific message from history
 * @route DELETE /messages/:id
 * @access Authenticated (Sender)
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
