const Evaluation = require("../models/Evaluation");

// Get all evaluations for a user
exports.getEvaluationsForUser = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({
      evaluatee: req.params.userId,
    }).populate("evaluator project assignment");
    res.json(evaluations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch evaluations", error: err.message });
  }
};

// Get all evaluations by a user
exports.getEvaluationsByUser = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({
      evaluator: req.params.userId,
    }).populate("evaluatee project assignment");
    res.json(evaluations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch evaluations", error: err.message });
  }
};

// Create evaluation
exports.createEvaluation = async (req, res) => {
  try {
    const evaluation = new Evaluation(req.body);
    await evaluation.save();
    res.status(201).json(evaluation);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create evaluation", error: err.message });
  }
};
