const messageRepository = require("../repositories/message.repository");
const chatRepository = require("../repositories/chat.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Send a message within a specific chat room
 * @param {string} chatId - Target chat identifier
 * @param {string} senderId - User ID of the sender
 * @param {string} content - Message text content
 * @returns {Promise<Object>} Formatted service response with the new message
 */
exports.sendMessage = async (chatId, senderId, content) => {
    try {
        const chat = await chatRepository.findById(chatId);
        if (!chat) return response(true, null, "Chat not found");

        if (!chat.members.map((id) => id.toString()).includes(senderId)) {
            return response(true, null, "Access denied: Not a member of this chat");
        }

        const message = await messageRepository.create({
            sender: senderId,
            chat: chatId,
            content,
            readBy: [senderId],
        });

        // Sync chat with newest message reference
        await chatRepository.update(chatId, { $push: { messages: message._id } });

        const populatedMessage = await messageRepository.findById(message._id, {
            populate: { path: "sender", select: "name email avatar" }
        });

        return response(false, populatedMessage, "Message sent successfully");
    } catch (err) {
        return response(true, null, err.message);
    }
};

/**
 * Fetch all message history for a specific chat
 * @param {string} chatId - Chat identifier
 * @param {string} userId - Requesting user identifier (for auth)
 * @returns {Promise<Object>} Formatted service response with message list
 */
exports.getMessagesByChat = async (chatId, userId) => {
    try {
        const chat = await chatRepository.findById(chatId);
        if (!chat) return response(true, null, "Chat not found");

        if (!chat.members.map((id) => id.toString()).includes(userId)) {
            return response(true, null, "Access denied: Not a member of this chat");
        }

        const messages = await messageRepository.findAll({ chat: chatId }, {
            sort: { createdAt: 1 },
            populate: { path: "sender", select: "name email avatar" }
        });

        return response(false, messages, "Messages fetched successfully");
    } catch (err) {
        return response(true, null, err.message);
    }
};

/**
 * Remove a specific message from history
 * @param {string} messageId - Message identifier
 * @param {string} userId - User identifier (must be the sender)
 * @returns {Promise<Object>} Formatted service response
 */
exports.deleteMessage = async (messageId, userId) => {
    try {
        const message = await messageRepository.findById(messageId);
        if (!message) return response(true, null, "Message not found");

        if (message.sender.toString() !== userId) {
            return response(true, null, "Access denied: Only sender can delete");
        }

        await messageRepository.remove(messageId);
        return response(false, null, "Message deleted successfully");
    } catch (err) {
        return response(true, null, err.message);
    }
};

/**
 * Low-level message creation
 * @param {Object} data - Message attribute data
 * @returns {Promise<Object>} Formatted service response
 */
exports.create = async (data) => {
  try {
    const message = await messageRepository.create(data);
    return response(false, message, "Message created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create message");
  }
};

/**
 * Fetch all messages in the system (System use)
 * @returns {Promise<Object>} Formatted service response
 */
exports.getAll = async () => {
  try {
    const messages = await messageRepository.findAll();
    return response(false, messages, "Messages fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch messages");
  }
};

/**
 * Fetch a specific message by ID
 * @param {string} id - Message identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.getById = async (id) => {
  try {
    const message = await messageRepository.findById(id);
    if (!message) return response(true, null, "Message not found");
    return response(false, message, "Message fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch message");
  }
};

/**
 * Update message content or status
 * @param {string} id - Message identifier
 * @param {Object} data - Update payload
 * @returns {Promise<Object>} Formatted service response
 */
exports.update = async (id, data) => {
  try {
    const message = await messageRepository.update(id, data);
    if (!message) return response(true, null, "Message not found");
    return response(false, message, "Message updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update message");
  }
};

/**
 * Remove a message record by ID
 * @param {string} id - Message identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const message = await messageRepository.remove(id);
    if (!message) return response(true, null, "Message not found");
    return response(false, null, "Message deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete message");
  }
};
