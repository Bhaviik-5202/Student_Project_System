const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "faculty students assignments",
    );
    res.json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "faculty students assignments",
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: err.message });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create course", error: err.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update course", error: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete course", error: err.message });
  }
};

// Get course assignments
exports.getCourseAssignments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("assignments");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course.assignments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch assignments", error: err.message });
  }
};

// Get course students
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("students");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course.students);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: err.message });
  }
};
