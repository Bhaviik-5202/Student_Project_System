const chatService = require('../services/chat.service');
const sendResponse = require('../utils/response');

/**
 * Chat Controller
 * Manages real-time communication channels, group chats, and messaging sessions.
 */

/**
 * Initialize a new chat session or group
 * @route POST /chats
 * @access Authenticated
 */
exports.createChat = async (req, res) => {
  try {
    const result = await chatService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Chat created successfully',
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
        message: 'Failed to create chat',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all active chat sessions for the authenticated user
 * @route GET /chats
 * @access Authenticated
 */
exports.getUserChats = async (req, res) => {
  try {
    const result = await chatService.getByUserId(req.user.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch user chats'
          : 'User chats fetched successfully',
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
 * Retrieve messages and metadata for a specific chat session
 * @route GET /chats/:id
 * @access Authenticated
 */
exports.getChatById = async (req, res) => {
  try {
    const result = await chatService.getById(req.params.chatId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Chat not found' : 'Chat fetched successfully',
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
 * Update chat settings or member list
 * @route PUT /chats/:id
 * @access Authenticated
 */
exports.updateChat = async (req, res) => {
  try {
    const result = await chatService.update(req.params.chatId, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Chat not found' : 'Chat updated successfully',
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
 * Permanently delete a chat record and message history
 * @route DELETE /chats/:id
 * @access Admin, Participant (if authorized)
 */
exports.deleteChat = async (req, res) => {
  try {
    const result = await chatService.remove(req.params.chatId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Chat not found' : 'Chat deleted successfully',
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
