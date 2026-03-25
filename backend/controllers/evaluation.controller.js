const evaluationService = require('../services/evaluation.service');
const sendResponse = require('../utils/response');

/**
 * Evaluation Controller
 * Handles academic grading, performance reviews, and assessment feedback.
 */

/**
 * Record a new evaluation
 * @route   POST /api/evaluations
 * @desc    Persist a grade and feedback for a project or student
 * @access  Faculty, Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Fetch all evaluations
 * @route   GET /api/evaluations
 * @desc    Retrieve a list of all grading and evaluation records
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Get detailed evaluation info
 * @route   GET /api/evaluations/:id
 * @desc    Retrieve specific scores and feedback for an evaluation entry
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Update evaluation record
 * @route   PUT /api/evaluations/:id
 * @desc    Modify existing grades or feedback details
 * @access  Faculty, Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Remove an evaluation record
 * @route   DELETE /api/evaluations/:id
 * @desc    Permanently delete an evaluation entry from the system
 * @access  Faculty, Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
