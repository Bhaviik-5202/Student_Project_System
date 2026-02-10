const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["planning", "in_progress", "completed", "on_hold", "cancelled"],
    default: "planning",
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  guide: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
