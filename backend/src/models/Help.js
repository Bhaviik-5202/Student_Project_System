const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subject: String,
  description: String,
  status: {
    type: String,
    enum: ["open", "closed", "pending"],
    default: "open",
  },
  createdAt: { type: Date, default: Date.now },
});

const knowledgeBaseSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  FAQ: mongoose.model("FAQ", faqSchema),
  SupportTicket: mongoose.model("SupportTicket", supportTicketSchema),
  KnowledgeBase: mongoose.model("KnowledgeBase", knowledgeBaseSchema),
};
