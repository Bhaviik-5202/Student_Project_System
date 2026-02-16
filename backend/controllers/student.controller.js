const studentService = require("../services/student.service");
const sendResponse = require("../utils/response");
const { validationResult } = require("express-validator");

/**
 * Create a new student
 * @route POST /students
 * @access Admin, Faculty
 */
exports.createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        {
          success: false,
          message: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const result = await studentService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create student"
          : "Student created successfully",
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
 * Get all students
 * @route GET /students
 * @access Authenticated
 */
exports.getAllStudents = async (req, res) => {
  try {
    const result = await studentService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch students"
          : "Students fetched successfully",
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
 * Get a student by ID
 * @route GET /students/:id
 * @access Authenticated
 */
exports.getStudentById = async (req, res) => {
  try {
    const result = await studentService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Student not found"
          : "Student fetched successfully",
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
 * Update a student by ID
 * @route PUT /students/:id
 * @access Admin, Faculty
 */
exports.updateStudent = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        {
          success: false,
          message: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const result = await studentService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Student not found"
          : "Student updated successfully",
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
 * Delete a student by ID
 * @route DELETE /students/:id
 * @access Admin, Faculty
 */
exports.deleteStudent = async (req, res) => {
  try {
    const result = await studentService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Student not found"
          : "Student deleted successfully",
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
