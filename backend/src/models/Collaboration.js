const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isGroup: { type: Boolean, default: false },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
});

const fileSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: String,
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
});

module.exports = {
  Message: mongoose.model("Message", messageSchema),
  Chat: mongoose.model("Chat", chatSchema),
  File: mongoose.model("File", fileSchema),
};
