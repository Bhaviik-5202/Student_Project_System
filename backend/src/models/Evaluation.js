const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  evaluatee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  criteria: [
    {
      criterion: String,
      score: Number,
      feedback: String,
    },
  ],
  type: { type: String, enum: ["self", "peer", "faculty"], default: "peer" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Evaluation", evaluationSchema);
