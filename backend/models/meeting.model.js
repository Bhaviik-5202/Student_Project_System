const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  type: { type: String, enum: ["team", "project"], default: "team" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
});

// Meeting model for MongoDB
module.exports = mongoose.model("Meeting", meetingSchema);
