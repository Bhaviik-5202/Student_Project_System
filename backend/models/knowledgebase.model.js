const mongoose = require("mongoose");

const knowledgeBaseSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

// KnowledgeBase model for MongoDB
module.exports = mongoose.model("KnowledgeBase", knowledgeBaseSchema);
