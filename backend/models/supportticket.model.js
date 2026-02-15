const mongoose = require("mongoose");

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

// SupportTicket model for MongoDB
module.exports = mongoose.model("SupportTicket", supportTicketSchema);
