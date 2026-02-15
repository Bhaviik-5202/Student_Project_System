const mongoose = require("mongoose");

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

// File model for MongoDB
module.exports = mongoose.model("File", fileSchema);
