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
  }f
};
