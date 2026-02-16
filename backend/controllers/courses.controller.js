const Course = require("../models/course.model");
const sendResponse = require("../utils/response");

/**
 * Create a new course
 * @route POST /courses
 * @access Admin, Faculty
 */
exports.createCourse = async (req, res) => {
  try {
    const { name, code, description, faculty } = req.body;

    const course = new Course({
      name,
      code,
      description,
      faculty,
    });

    await course.save();

    sendResponse(
      res,
      {
        success: true,
        message: "Course created successfully",
        data: course,
        error: null,
      },
      201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to create course",
        data: null,
        error: error.message,
      },
      500,
    );
  }
  f;
};

/** Get all courses
 * @route GET /courses
 * @access Public
 * */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("faculty", "name email");
    sendResponse(
      res,
      {
        success: true,
        message: "Courses retrieved successfully",
        data: courses,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to retrieve courses",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get a course by ID
 * @route GET /courses/:id
 * @access Public
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "faculty",
      "name email",
    );
    if (!course) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Course not found",
          data: null,
          error: null,
        },
        404,
      );
    } else {
      sendResponse(
        res,
        {
          success: true,
          message: "Course retrieved successfully",
          data: course,
          error: null,
        },
        200,
      );
    }
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to retrieve course",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Update a course
 * @route PUT /courses/:id
 * @access Admin, Faculty
 */
exports.updateCourse = async (req, res) => {
  try {
    const { name, code, description, faculty } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code, description, faculty },
      { new: true },
    );
    if (!course) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Course not found",
          data: null,
          error: null,
        },
        404,
      );
    } else {
      sendResponse(
        res,
        {
          success: true,
          message: "Course updated successfully",
          data: course,
          error: null,
        },
        200,
      );
    }
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to update course",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/****
 * Delete a course
 * @route DELETE /courses/:id
 * @access Admin
 * */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Course not found",
          data: null,
          error: null,
        },
        404,
      );
    } else {
      sendResponse(
        res,
        {
          success: true,
          message: "Course deleted successfully",
          data: course,
          error: null,
        },
        200,
      );
    }
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to delete course",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
