const submissionService = require('../services/submission.service');
const sendResponse = require('../utils/response');

/**
 * Submission Controller
 * Handles student work submissions, including file uploads and status tracking.
 */

/**
 * Create a new work submission
 * @route POST /submissions
 * @access Student
 */
exports.createSubmission = async (req, res) => {
  try {
    const submissionData = { ...req.body };

    // Set student ID if not provided (should come from auth)
    if (!submissionData.student && req.user) {
      submissionData.student = req.user.id || req.user._id;
    }

    // Handle file uploads via Multer
    if (req.files && req.files.length > 0) {
      submissionData.files = req.files.map((file) => file.path);
    }

    const result = await submissionService.create(submissionData);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to create submission'
          : 'Submission created successfully',
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
 * Fetch all submissions across all students and projects
 * @route GET /submissions
 * @access Faculty, Admin
 */
exports.getAllSubmissions = async (req, res) => {
  try {
    const result = await submissionService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch submissions'
          : 'Submissions fetched successfully',
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
 * Retrieve a specific submission by its ID
 * @route GET /submissions/:id
 * @access Faculty, Admin
 */
exports.getSubmissionById = async (req, res) => {
  try {
    const result = await submissionService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Submission not found'
          : 'Submission fetched successfully',
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
 * Update submission contents or status
 * @route PUT /submissions/:id
 * @access Faculty, Admin
 */
exports.updateSubmission = async (req, res) => {
  try {
    const result = await submissionService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to update submission'
          : 'Submission updated successfully',
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

exports.deleteSubmission = async (req, res) => {
  try {
    const result = await submissionService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to delete submission'
          : 'Submission deleted successfully',
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
 * Get the current student's submission history
 * @route GET /submissions/history
 * @access Student
 */
exports.getSubmissionHistory = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    // We filter by student and populate the assignment details
    const result = await submissionService.getByStudentId(studentId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch submission history'
          : 'Submission history retrieved successfully',
        data: result.data || [],
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
