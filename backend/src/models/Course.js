const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
