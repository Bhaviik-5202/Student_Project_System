const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  fileUrl: String,
  submittedAt: { type: Date, default: Date.now },
  grade: String,
  feedback: String,
});

module.exports = mongoose.model("Submission", submissionSchema);
