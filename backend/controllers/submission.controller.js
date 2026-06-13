const submissionService = require('../services/submission.service');
const sendResponse = require('../utils/response');
const Student = require('../models/student.model');

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
      // Prefer the Student._id associated with the authenticated user's email
      if (req.user.email) {
        const studentDoc = await Student.findOne({ email: req.user.email }).lean();
        if (studentDoc && studentDoc._id) {
          submissionData.student = studentDoc._id;
        } else {
          submissionData.student = req.user.id || req.user._id;
        }
      } else {
        submissionData.student = req.user.id || req.user._id;
      }
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

    const submission = await submissionService.getById(req.params.id);
    if (!submission || submission.error) {
      return sendResponse(
        res,
        { success: false, message: 'Submission not found' },
        404
      );
    }

    // RBAC: Only owner, admin, or faculty can view
    const isAdminOrFaculty = ['admin', 'faculty'].includes(String(req.user && req.user.role));
    let isOwner = false;
    if (submission && submission.data && submission.data.student) {
      const studentDoc = await Student.findById(submission.data.student).lean();
      if (studentDoc && req.user && req.user.email) {
        isOwner = String(studentDoc.email).toLowerCase() === String(req.user.email).toLowerCase();
      } else if (String(submission.data.student) === String(req.user.id)) {
        isOwner = true;
      }
    }

    if (!isOwner && !isAdminOrFaculty) {
      return sendResponse(res, { success: false, message: 'Access denied' }, 403);
    }

    sendResponse(
      res,
      {
        success: true,
        message: 'Submission fetched successfully',
        data: submission.data,
        error: null,
      },
      200
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
    const submission = await submissionService.getById(req.params.id);
    if (!submission || submission.error) {
      return sendResponse(
        res,
        { success: false, message: 'Submission not found' },
        404
      );
    }

    // RBAC: Only owner, admin, or faculty can update
    const isAdminOrFacultyUp = ['admin', 'faculty'].includes(String(req.user && req.user.role));
    let isOwnerUp = false;
    if (submission && submission.data && submission.data.student) {
      const studentDoc2 = await Student.findById(submission.data.student).lean();
      if (studentDoc2 && req.user && req.user.email) {
        isOwnerUp = String(studentDoc2.email).toLowerCase() === String(req.user.email).toLowerCase();
      } else if (String(submission.data.student) === String(req.user.id)) {
        isOwnerUp = true;
      }
    }

    if (!isOwnerUp && !isAdminOrFacultyUp) {
      return sendResponse(res, { success: false, message: 'Access denied' }, 403);
    }

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

/**
 * Permanently delete a submission record
 * @route DELETE /submissions/:id
 * @access Faculty, Admin
 */
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await submissionService.getById(req.params.id);
    if (!submission || submission.error) {
      return sendResponse(
        res,
        { success: false, message: 'Submission not found' },
        404
      );
    }

    // RBAC: Only owner, admin, or faculty can delete
    const isAdminOrFacultyDel = ['admin', 'faculty'].includes(String(req.user && req.user.role));
    let isOwnerDel = false;
    if (submission && submission.data && submission.data.student) {
      const studentDoc3 = await Student.findById(submission.data.student).lean();
      if (studentDoc3 && req.user && req.user.email) {
        isOwnerDel = String(studentDoc3.email).toLowerCase() === String(req.user.email).toLowerCase();
      } else if (String(submission.data.student) === String(req.user.id)) {
        isOwnerDel = true;
      }
    }

    if (!isOwnerDel && !isAdminOrFacultyDel) {
      return sendResponse(res, { success: false, message: 'Access denied' }, 403);
    }

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
    // Resolve the Student._id from the authenticated user email when possible
    let studentId = req.user.id || req.user._id;
    if (req.user && req.user.email) {
      const studentDoc = await Student.findOne({ email: req.user.email }).lean();
      if (studentDoc && studentDoc._id) studentId = studentDoc._id;
    }
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
