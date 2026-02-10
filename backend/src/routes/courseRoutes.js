const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// GET /api/courses
router.get("/", courseController.getAllCourses);
// GET /api/courses/:id
router.get("/:id", courseController.getCourseById);
// POST /api/courses
router.post("/", courseController.createCourse);
// PUT /api/courses/:id
router.put("/:id", courseController.updateCourse);
// DELETE /api/courses/:id
router.delete("/:id", courseController.deleteCourse);
// GET /api/courses/:id/assignments
router.get("/:id/assignments", courseController.getCourseAssignments);
// GET /api/courses/:id/students
router.get("/:id/students", courseController.getCourseStudents);

module.exports = router;
