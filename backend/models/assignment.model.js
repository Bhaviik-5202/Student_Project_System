const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
  createdAt: { type: Date, default: Date.now },
});

// Assignment model for MongoDB
module.exports = mongoose.model("Assignment", assignmentSchema);
