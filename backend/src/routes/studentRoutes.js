const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// GET /api/students
router.get("/", studentController.getAllStudents);
// GET /api/students/:id
router.get("/:id", studentController.getStudentById);
// POST /api/students
router.post("/", studentController.createStudent);
// PUT /api/students/:id
router.put("/:id", studentController.updateStudent);
// DELETE /api/students/:id
router.delete("/:id", studentController.deleteStudent);
// GET /api/students/:id/projects
router.get("/:id/projects", studentController.getStudentProjects);
// POST /api/students/:id/projects
router.post("/:id/projects", studentController.addStudentProject);
// GET /api/students/:id/grades
router.get("/:id/grades", studentController.getStudentGrades);

module.exports = router;
