const courseService = require("../services/courseService");
const ApiError = require("../utils/ApiError");

// Get all courses
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseService.findAll();
    return res.json({ success: true, data: courses });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch courses", [err.message]));
  }
};

// Get course by ID
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.findById(req.params.id);
    if (!course) return next(new ApiError(404, "Course not found"));
    return res.json({ success: true, data: course });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch course", [err.message]));
  }
};

// Create course
exports.createCourse = async (req, res, next) => {
  try {
    const course = await courseService.create(req.body);
    return res.status(201).json({ success: true, data: course });
  } catch (err) {
    return next(new ApiError(400, "Failed to create course", [err.message]));
  }
};

// Update course
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.update(req.params.id, req.body);
    if (!course) return next(new ApiError(404, "Course not found"));
    return res.json({ success: true, data: course });
  } catch (err) {
    return next(new ApiError(400, "Failed to update course", [err.message]));
  }
};

// Delete course
const Course = require("../models/Course");
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return next(new ApiError(404, "Course not found"));
    return res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    return next(new ApiError(500, "Failed to delete course", [err.message]));
  }
};

// Get course assignments
exports.getCourseAssignments = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("assignments");
    if (!course) return next(new ApiError(404, "Course not found"));
    return res.json({ success: true, data: course.assignments });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch assignments", [err.message]),
    );
  }
};

// Get course students
exports.getCourseStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("students");
    if (!course) return next(new ApiError(404, "Course not found"));
    return res.json({ success: true, data: course.students });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch students", [err.message]));
  }
};
