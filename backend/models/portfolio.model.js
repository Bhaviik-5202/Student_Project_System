const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  skills: [String],
  badges: [String],
  transcriptUrl: String,
  createdAt: { type: Date, default: Date.now },
});

// Portfolio model for MongoDB
module.exports = mongoose.model("Portfolio", portfolioSchema);
