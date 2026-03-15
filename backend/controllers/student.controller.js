const studentService = require("../services/student.service");
const sendResponse = require("../utils/response");

/**
 * Student Controller
 * Manages comprehensive student profile data, academic records, 
 * and student-specific project associations.
 */

/**
 * Register a new student profile
 * @route POST /students
 * @access Admin
 */
exports.createStudent = async (req, res) => {
  try {
    const result = await studentService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Student created successfully",
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
 * Fetch all student profiles with pagination and filters
 * @route GET /students
 * @access Admin, Faculty
 */
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await studentService.getAll({ page, limit, filters });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch students"
          : "Students fetched successfully",
        data: result.data ? result.data.students : null,
        error: result.error || null,
        pagination: result.data ? {
          total: result.data.total,
          page: result.data.page,
          limit: result.data.limit,
          totalPages: result.data.totalPages,
        } : null,
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
 * Get detailed profile information for a specific student
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
        message: result.error ? "Student not found" : "Student fetched successfully",
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
 * Update student academic or profile information
 * @route PUT /students/:id
 * @access Admin, Student (own profile)
 */
exports.updateStudent = async (req, res) => {
  try {
    const result = await studentService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "Student not found" : "Student updated successfully",
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
 * Deactivate or remove a student record
 * @route DELETE /students/:id
 * @access Admin
 */
exports.deleteStudent = async (req, res) => {
  try {
    const result = await studentService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "Student not found" : "Student deleted successfully",
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
 * Verify if a student ID exists (Internal/Direct check)
 * @route GET /students/verify/:studentId
 */
exports.verifyStudentId = async (req, res) => {
  try {
    const result = await studentService.getById(req.params.studentId);
    
    sendResponse(
      res,
      {
        success: !!result.data,
        message: result.data ? "Student ID verified" : "Student ID not found",
        data: { exists: !!result.data },
        error: null,
      },
      result.data ? 200 : 404,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Verification failed",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
