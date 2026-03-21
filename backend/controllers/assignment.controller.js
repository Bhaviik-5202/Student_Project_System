const assignmentService = require("../services/assignment.service");
const sendResponse = require("../utils/response");
const { validationResult } = require("express-validator");

/**
 * Assignment Controller
 * Handles HTTP requests related to academic assignments, including creation,
 * retrieval, updates, and role-based filtering.
 */

/**
 * Create a new assignment
 * @route POST /assignments
 * @access Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createAssignment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Validation failed",
          data: null,
          error: errors.array(),
        },
        400,
      );
    }

    const assignmentData = { ...req.body };

    // Handle multiple file uploads via Multer
    if (req.files && req.files.length > 0) {
      assignmentData.attachments = req.files.map((file) => file.path);
    }

    const result = await assignmentService.create(assignmentData);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : "Assignment created successfully",
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
        message: "Failed to create assignment",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Get all assignments with pagination and filtering
 * @route GET /assignments
 * @access Authenticated
 * @query {number} page - Page number for pagination
 * @query {number} limit - Number of records per page
 * @query {Object} filters - Search criteria (title, courseId, etc.)
 */
exports.getAllAssignments = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await assignmentService.getAll({ page, limit, filters });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch assignments"
          : "Assignments fetched successfully",
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
 * Get detailed information for a specific assignment
 * @route GET /assignments/:id
 * @access Authenticated
 */
exports.getAssignmentById = async (req, res) => {
  try {
    const result = await assignmentService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch assignment"
          : "Assignment fetched successfully",
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
 * Update assignment details
 * @route PUT /assignments/:id
 * @access Admin, Faculty
 */
exports.updateAssignment = async (req, res) => {
  try {
    const result = await assignmentService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update assignment"
          : "Assignment updated successfully",
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
 * Validate assignment data before submission
 * @route POST /assignments/validate
 * @access Admin, Faculty
 */
exports.validateAssignment = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Validation failed",
        data: null,
        error: errors.array(),
      },
      400,
    );
  }

  sendResponse(
    res,
    {
      success: true,
      message: "Validation successful",
      data: null,
      error: null,
    },
    200,
  );
};

/**
 * Permanently delete an assignment
 * @route DELETE /assignments/:id
 * @access Admin, Faculty
 */
exports.deleteAssignment = async (req, res) => {
  try {
    const result = await assignmentService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete assignment"
          : "Assignment deleted successfully",
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
 * List all assignments assigned to a specific student
 * @route GET /assignments/student/:studentId
 * @access Authenticated
 */
exports.getAssignmentsByStudentId = async (req, res) => {
  try {
    const result = await assignmentService.getByStudentId(req.params.studentId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch assignments for student"
          : "Assignments fetched successfully",
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
 * List assignments associated with a specific activity
 * @route GET /assignments/activity/:activityId
 * @access Authenticated
 */
exports.getAssignmentsByActivityId = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await assignmentService.getByActivityId(
      req.params.activityId,
      { page, limit },
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch assignments for activity"
          : "Assignments fetched successfully",
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
 * List assignments published by a specific faculty member
 * @route GET /assignments/faculty/:facultyId
 * @access Authenticated
 */
exports.getAssignmentsByFacultyId = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await assignmentService.getByFacultyId(
      req.params.facultyId,
      { page, limit },
    );
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch assignments for faculty"
          : "Assignments fetched successfully",
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
 * List all assignments for a specific academic course
 * @route GET /assignments/course/:courseId
 * @access Authenticated
 */
exports.getAssignmentsByCourseId = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await assignmentService.getByCourseId(req.params.courseId, {
      page,
      limit,
    });
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch assignments for course"
          : "Assignments fetched successfully",
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
 * List assignments for a specific student batch
 * @route GET /assignments/batch/:batchId
 * @access Authenticated
 */
exports.getAssignmentsByBatchId = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await assignmentService.getByBatchId(req.params.batchId, {
      page,
      limit,
    });
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch assignments for batch"
          : "Assignments fetched successfully",
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
 * Get the grading rubric for an assignment
 * @route GET /assignments/rubric/:id
 * @access Admin, Faculty
 */
exports.getRubric = async (req, res) => {
  try {
    const result = await assignmentService.getById(req.params.id);
    if (result.error) {
      return sendResponse(res, result, 404);
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Rubric fetched successfully",
        data: result.data.rubric || { name: "", criteria: [] },
        error: null,
      },
      200,
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
 * Save the grading rubric for an assignment
 * @route POST /assignments/rubric/:id
 * @access Admin, Faculty
 */
exports.saveRubric = async (req, res) => {
  try {
    const result = await assignmentService.update(req.params.id, {
      rubric: req.body,
    });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "Failed to save rubric" : "Rubric saved successfully",
        data: result.data?.rubric || null,
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
