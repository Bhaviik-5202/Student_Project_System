const coursesService = require("../services/courses.service");
const sendResponse = require("../utils/response");

/**
 * Courses Controller
 * Manages academic courses, including creation, listing, and updates.
 */

/**
 * Create a new academic course
 * @route POST /courses
 * @access Admin
 */
exports.createCourse = async (req, res) => {
  try {
    const result = await coursesService.create(req.body);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Course created successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to create course",
        data: null,
        error: err.message,
      },
      500,
    );
  }
};

/**
 * Fetch all registered courses
 * @route GET /courses
 * @access Authenticated
 */
exports.getAllCourses = async (req, res) => {
  try {
    const result = await coursesService.getAll();
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Courses fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch courses",
        data: null,
        error: err.message,
      },
      500,
    );
  }
};

/**
 * Get detailed info for a specific course
 * @route GET /courses/:id
 * @access Authenticated
 */
exports.getCourseById = async (req, res) => {
  try {
    const result = await coursesService.getById(req.params.id);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Course fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch course",
        data: null,
        error: err.message,
      },
      500,
    );
  }
};

/**
 * Update course details or faculty assignment
 * @route PUT /courses/:id
 * @access Admin
 */
exports.updateCourse = async (req, res) => {
  try {
    const result = await coursesService.update(req.params.id, req.body);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Course updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to update course",
        data: null,
        error: err.message,
      },
      500,
    );
  }
};

/**
 * Permanently remove a course from the system
 * @route DELETE /courses/:id
 * @access Admin
 */
exports.deleteCourse = async (req, res) => {
  try {
    const result = await coursesService.remove(req.params.id);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Course deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to delete course",
        data: null,
        error: err.message,
      },
      500,
    );
  }
};

/**
 * Enroll the current user (student) in a course
 * @route POST /courses/:id/enroll
 * @access Student
 */
exports.enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.id;
    const result = await coursesService.enroll(studentId, courseId);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Enrolled in course successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to enroll in course",
        data: null,
        error: err.message,
      },
      500,
    );
  }
};

/**
 * Get courses enrolled by the current student
 * @route GET /courses/my
 * @access Student
 */
exports.getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await coursesService.getEnrolled(studentId);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "My courses fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch my courses",
        data: null,
        error: err.message,
      },
      500,
    );
  }
};
