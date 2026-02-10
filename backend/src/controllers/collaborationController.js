const { Message, Chat, File } = require("../models/Collaboration");
const User = require("../models/User");

// Get all chats for a user
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.params.userId }).populate(
      "members messages",
    );
    res.json(chats);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch chats", error: err.message });
  }
};

// Get messages for a chat
exports.getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate({
      path: "messages",
      populate: { path: "sender" },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat.messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: err.message });
  }
};

// Send message to chat
exports.sendMessage = async (req, res) => {
  try {
    const { sender, content } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    const message = new Message({ sender, content, chat: chat._id });
    await message.save();
    chat.messages.push(message._id);
    await chat.save();
    res.status(201).json(message);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to send message", error: err.message });
  }
};

// Create group chat
exports.createGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    const chat = new Chat({ name, members, isGroup: true });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create group chat", error: err.message });
  }
};

// Upload file to chat
exports.uploadFile = async (req, res) => {
  try {
    const { uploader, fileName, fileUrl, chatId } = req.body;
    const file = new File({ uploader, fileName, fileUrl, chat: chatId });
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to upload file", error: err.message });
  }
};

// Get files for a chat
exports.getChatFiles = async (req, res) => {
  try {
    const files = await File.find({ chat: req.params.chatId });
    res.json(files);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: err.message });
  }
};
