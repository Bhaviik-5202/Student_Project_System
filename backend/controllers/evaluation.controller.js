const evaluationService = require('../services/evaluation.service');
const sendResponse = require('../utils/response');

/**
 * Evaluation Controller
 * Handles academic grading, performance reviews, and assessment feedback.
 */

/**
 * Record a new evaluation or grade
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
          ? result.message
          : 'Evaluation created successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Fetch all evaluation records with optional filters
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
          ? result.message
          : 'Evaluations fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get detailed feedback and scores for a specific evaluation
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
          ? result.message
          : 'Evaluation fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update scores or feedback for an existing evaluation
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
          ? result.message
          : 'Evaluation updated successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Permanently remove an evaluation record
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
          ? result.message
          : 'Evaluation deleted successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
