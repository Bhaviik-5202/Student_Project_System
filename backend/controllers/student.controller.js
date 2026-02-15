const studentService = require("../services/student.service");
const sendResponse = require("../utils/response");
const { validationResult } = require("express-validator");

/**
 * Create a new student
 * @route POST /students
 * @access Admin, Faculty
 */
exports.createStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      {
        error: true,
        data: null,
        message: errors
          .array()
          .map((e) => e.msg)
          .join(", "),
      },
      400,
    );
  }
  const result = await studentService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
/**
 * Get all students with pagination and filtering
 * @route GET /students
 * @access Authenticated
 * @query page, limit, name, email, etc.
 */
exports.getAllStudents = async (req, res) => {
  const result = await studentService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
/**
 * Get a student by ID
 * @route GET /students/:id
 * @access Authenticated
 */
exports.getStudentById = async (req, res) => {
  const result = await studentService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
/**
 * Update a student by ID
 * @route PUT /students/:id
 * @access Admin, Faculty
 */
exports.updateStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      {
        error: true,
        data: null,
        message: errors
          .array()
          .map((e) => e.msg)
          .join(", "),
      },
      400,
    );
  }
  const result = await studentService.update(req.params.id, req.body);
  if (result.error) {
    return sendResponse(res, result, 404);
  }
  sendResponse(res, result, 200);
};
/**
 * Delete a student by ID
 * @route DELETE /students/:id
 * @access Admin, Faculty
 */
exports.deleteStudent = async (req, res) => {
  const result = await studentService.remove(req.params.id);
  if (result.error) {
    return sendResponse(res, result, 404);
  }
  sendResponse(res, result, 200);
};
