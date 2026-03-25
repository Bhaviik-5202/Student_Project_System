/**
 * Chat Service
 * Business logic layer for real-time chat room management.
 */
const chatRepository = require('../repositories/chat.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create chat instance
 * @param {Object} data - Chat data payload
 * @returns {Promise<Object>} Formatted service response with new chat room
 */
exports.create = async (data) => {
  try {
    const chat = await chatRepository.create(data);
    return response(false, chat, 'Chat created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create chat');
  }
};

/**
 * Fetch all registered chats
 * @returns {Promise<Object>} Formatted service response with chat list
 */
exports.getAll = async () => {
  try {
    const chats = await chatRepository.findAll();
    return response(false, chats, 'Chats fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch chats');
  }
};

/**
 * Get chats by user
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} Formatted service response with user's active chat list
 */
exports.getByUserId = async (userId) => {
  try {
    const chats = await chatRepository.findAll({ members: userId });
    return response(false, chats, 'User chats fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch user chats');
  }
};

/**
 * Get chat by ID
 * @param {string} id - Chat identifier
 * @returns {Promise<Object>} Formatted service response with specific chat metadata
 */
exports.getById = async (id) => {
  try {
    const chat = await chatRepository.findById(id);
    if (!chat) return response(true, null, 'Chat not found');
    return response(false, chat, 'Chat fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch chat');
  }
};

/**
 * Update chat attributes
 * @param {string} id - Chat identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified chat data
 */
exports.update = async (id, data) => {
  try {
    const chat = await chatRepository.update(id, data);
    if (!chat) return response(true, null, 'Chat not found');
    return response(false, chat, 'Chat updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update chat');
  }
};

/**
 * Delete chat instance
 * @param {string} id - Chat identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const chat = await chatRepository.remove(id);
    if (!chat) return response(true, null, 'Chat not found');
    return response(false, null, 'Chat deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete chat');
  }
};
