const collaborationService = require("../services/collaborationService");
const ApiError = require("../utils/ApiError");

// Get all chats for a user
exports.getUserChats = async (req, res, next) => {
  try {
    const chats = await collaborationService.getUserChats(req.params.userId);
    return res.json({ success: true, data: chats });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch user chats", [err.message]));
  }
};

// Get messages for a chat
exports.getChatMessages = async (req, res, next) => {
  try {
    const chat = await collaborationService.getChatMessages(req.params.chatId);
    if (!chat) return next(new ApiError(404, "Chat not found"));
    return res.json({ success: true, data: chat.messages });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch chat messages", [err.message]),
    );
  }
};

// Send message to chat
exports.sendMessage = async (req, res, next) => {
  try {
    const message = await collaborationService.sendMessage(
      req.params.chatId,
      req.body,
    );
    if (!message) return next(new ApiError(404, "Chat not found"));
    return res.status(201).json({ success: true, data: message });
  } catch (err) {
    return next(new ApiError(400, "Failed to send message", [err.message]));
  }
};

// Create group chat
exports.createGroupChat = async (req, res, next) => {
  try {
    const chat = await collaborationService.createGroupChat(req.body);
    return res.status(201).json({ success: true, data: chat });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to create group chat", [err.message]),
    );
  }
};

// Upload file to chat
exports.uploadFile = async (req, res, next) => {
  try {
    const { uploader, fileName, fileUrl, chatId } = req.body;
    const file = new File({ uploader, fileName, fileUrl, chat: chatId });
    await file.save();
    return res.status(201).json({ success: true, data: file });
  } catch (err) {
    return next(new ApiError(400, "Failed to upload file", [err.message]));
  }
};

// Get files for a chat
exports.getChatFiles = async (req, res, next) => {
  try {
    const files = await File.find({ chat: req.params.chatId });
    return res.json({ success: true, data: files });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch files", [err.message]));
  }
};
