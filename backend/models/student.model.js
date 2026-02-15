const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  grades: [
    {
      project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
      grade: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Student model for MongoDB
module.exports = mongoose.model("Student", studentSchema);
