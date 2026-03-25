const chatService = require('../services/chat.service');
const sendResponse = require('../utils/response');

/**
 * Chat Controller
 * Manages real-time communication channels, group chats, and messaging sessions.
 */

/**
 * Create a new chat
 * @route   POST /api/chats
 * @desc    Initialize a new one-on-one or group chat session
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Fetch user chats
 * @route   GET /api/chats
 * @desc    Retrieve all active chat conversations for the current user
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Get chat by ID
 * @route   GET /api/chats/:id
 * @desc    Retrieve detailed information and participant list for a chat
 * @access  Authenticated (Participant)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Update chat details
 * @route   PUT /api/chats/:id
 * @desc    Modify chat settings, title, or participant list
 * @access  Authenticated (Participant)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Delete a chat
 * @route   DELETE /api/chats/:id
 * @desc    Permanently remove a chat session and its history
 * @access  Admin, Participant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
