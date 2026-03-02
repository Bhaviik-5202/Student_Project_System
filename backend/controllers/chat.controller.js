const Chat = require("../models/chat.model");
const ApiError = require("../utils/ApiError");
const sendResponse = require("../utils/response");
const mongoose = require("mongoose");

/**
 * Create Chat
 * @route POST /chats
 * @access Private
 */
exports.createChat = async (req, res, next) => {
  try {
    let { members = [], isGroup = false, groupName } = req.body;

    // Ensure logged-in user is included
    if (!members.includes(req.user.id)) {
      members.push(req.user.id);
    }

    // Remove duplicate members
    members = [...new Set(members)];

    const chat = await Chat.create({
      members,
      isGroup,
      name: isGroup ? groupName : null,
    });

    return sendResponse(
      res,
      {
        success: true,
        message: "Chat created successfully",
        data: chat,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Chats
 * @route GET /chats
 * @access Private
 */
exports.getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      members: req.user.id,
    })
      .populate("members", "name email avatar")
      .sort({ updatedAt: -1 });

    return sendResponse(res, {
      success: true,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Chat by ID
 * @route GET /chats/:chatId
 * @access Private
 */
exports.getChatById = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId).populate(
      "members",
      "name email avatar",
    );

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    if (!chat.members.some((m) => m._id.toString() === req.user.id)) {
      throw new ApiError(403, "Access denied");
    }

    return sendResponse(res, {
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Chat
 * @route PUT /chats/:chatId
 * @access Private
 */
exports.updateChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { members, isGroup, groupName } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    if (!chat.members.map((id) => id.toString()).includes(req.user.id)) {
      throw new ApiError(403, "Access denied");
    }

    if (members) {
      chat.members = [...new Set(members)];
    }

    if (isGroup !== undefined) {
      chat.isGroup = isGroup;
    }

    if (groupName !== undefined) {
      chat.name = groupName;
    }

    await chat.save();

    return sendResponse(res, {
      success: true,
      message: "Chat updated successfully",
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Chat
 * @route DELETE /chats/:chatId
 * @access Private
 */

exports.deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    if (!chat.members.map((id) => id.toString()).includes(req.user.id)) {
      throw new ApiError(403, "Access denied");
    }

    await chat.deleteOne();

    return sendResponse(res, {
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
