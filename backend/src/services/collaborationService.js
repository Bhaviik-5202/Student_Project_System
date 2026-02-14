const { Message, Chat, File } = require("../models/Collaboration");

exports.getUserChats = async (userId) => {
  return Chat.find({ members: userId }).populate("members messages");
};

exports.getChatMessages = async (chatId) => {
  return Chat.findById(chatId).populate({
    path: "messages",
    populate: { path: "sender" },
  });
};

exports.sendMessage = async (chatId, data) => {
  const chat = await Chat.findById(chatId);
  if (!chat) return null;
  const message = new Message({ ...data, chat: chat._id });
  await message.save();
  chat.messages.push(message._id);
  await chat.save();
  return message;
};

exports.createGroupChat = async (data) => {
  const chat = new Chat({ ...data, isGroup: true });
  return chat.save();
};
