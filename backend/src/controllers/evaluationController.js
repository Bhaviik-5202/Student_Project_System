const evaluationService = require("../services/evaluationService");
const ApiError = require("../utils/ApiError");

// Get all evaluations for a user
const getEvaluationsForUser = async (req, res, next) => {
  try {
    const evaluations = await evaluationService.findForUser(req.params.userId);
    return res.json({ success: true, data: evaluations });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch evaluations for user", [err.message]),
    );
  }
};

// Get all evaluations
const getAllEvaluations = async (req, res, next) => {
  try {
    const evaluations = await evaluationService.findAll();
    return res.json({ success: true, data: evaluations });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch evaluations", [err.message]),
    );
  }
};

// Get evaluation by ID
const getEvaluationById = async (req, res, next) => {
  try {
    const evaluation = await evaluationService.findById(req.params.id);
    if (!evaluation) {
      return next(new ApiError(404, "Evaluation not found"));
    }
    return res.json({ success: true, data: evaluation });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch evaluation", [err.message]));
  }
};

// Create evaluation
const createEvaluation = async (req, res, next) => {
  try {
    const evaluation = await evaluationService.create(req.body);
    return res.status(201).json({ success: true, data: evaluation });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to create evaluation", [err.message]),
    );
  }
};

// Update evaluation
const updateEvaluation = async (req, res, next) => {
  try {
    const evaluation = await evaluationService.update(req.params.id, req.body);
    if (!evaluation) {
      return next(new ApiError(404, "Evaluation not found"));
    }
    return res.json({ success: true, data: evaluation });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to update evaluation", [err.message]),
    );
  }
};

// Delete evaluation
const deleteEvaluation = async (req, res, next) => {
  try {
    const deleted = await evaluationService.delete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Evaluation not found"));
    }
    return res.json({
      success: true,
      message: "Evaluation deleted successfully",
    });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to delete evaluation", [err.message]),
    );
  }
};

module.exports = {
  getEvaluationsForUser,
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
};
