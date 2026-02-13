const Evaluation = require("../models/Evaluation");

exports.findForUser = async (userId) => {
  return Evaluation.find({ evaluatee: userId }).populate(
    "evaluator project assignment",
  );
};
exports.findByUser = async (userId) => {
  return Evaluation.find({ evaluator: userId }).populate(
    "evaluatee project assignment",
  );
};
exports.create = async (data) => {
  const evaluation = new Evaluation(data);
  return evaluation.save();
};
