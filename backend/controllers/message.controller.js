const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/response");

/**
 * Send a message in a chat
 * @route POST /api/v1/messages
 * @access Authenticated
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    if (!chat.members.map((id) => id.toString()).includes(req.user.id)) {
      throw new ApiError(403, "Access denied");
    }

    const message = await Message.create({
      sender: req.user.id,
      chat: chatId,
      content,
      readBy: [req.user.id],
    });

    chat.messages.push(message._id);
    await chat.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email avatar",
    );

    return sendResponse(
      res,
      {
        success: true,
        message: "Message sent successfully",
        data: populatedMessage,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages for a chat
 * @route GET /api/v1/messages/:chatId
 * @access Authenticated
 */
exports.getMessagesByChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(400, "Invalid Chat ID");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }
    if (!chat.members.map((id) => id.toString()).includes(req.user.id)) {
      throw new ApiError(403, "Access denied");
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    return sendResponse(res, {
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a message
 * @route DELETE /api/v1/messages/:messageId
 * @access Authenticated
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    if (message.sender.toString() !== req.user.id) {
      throw new ApiError(403, "You can only delete your own messages");
    }

    await message.deleteOne();

    return sendResponse(res, {
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
