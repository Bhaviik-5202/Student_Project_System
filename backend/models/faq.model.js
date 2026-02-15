const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// FAQ model for MongoDB
module.exports = mongoose.model("FAQ", faqSchema);
