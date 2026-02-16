const evaluationService = require("../services/evaluation.service");
const sendResponse = require("../utils/response");

/**
 * Create a new evaluation
 * @route POST /evaluations
 * @access Faculty, Admin
 */
exports.createEvaluation = async (req, res) => {
  try {
    const result = await evaluationService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create evaluation"
          : "Evaluation created successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get all evaluations
 * @route GET /evaluations
 * @access Authenticated
 */
exports.getAllEvaluations = async (req, res) => {
  try {
    const result = await evaluationService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch evaluations"
          : "Evaluations fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get an evaluation by ID
 * @route GET /evaluations/:id
 * @access Authenticated
 */
exports.getEvaluationById = async (req, res) => {
  try {
    const result = await evaluationService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Evaluation not found"
          : "Evaluation fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Update an evaluation by ID
 * @route PUT /evaluations/:id
 * @access Faculty, Admin
 */
exports.updateEvaluation = async (req, res) => {
  try {
    const result = await evaluationService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update evaluation"
          : "Evaluation updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Delete an evaluation by ID
 * @route DELETE /evaluations/:id
 * @access Faculty, Admin
 */
exports.deleteEvaluation = async (req, res) => {
  try {
    const result = await evaluationService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete evaluation"
          : "Evaluation deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
