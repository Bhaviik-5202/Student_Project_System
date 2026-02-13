const studentService = require("../services/studentService");
const ApiError = require("../utils/ApiError");

const handleAsync = require("../utils/handleAsync");
// Get all students
exports.getAllStudents = handleAsync(async (req, res) => {
  const students = await studentService.findAll();
  res.json({ success: true, data: students });
});

// Get student by ID
exports.getStudentById = handleAsync(async (req, res, next) => {
  const student = await studentService.findById(req.params.id);
  if (!student) return next(new ApiError(404, "Student not found"));
  res.json({ success: true, data: student });
});

// Create student
exports.createStudent = handleAsync(async (req, res) => {
  const student = await studentService.create(req.body);
  res.status(201).json({ success: true, data: student });
});

// Update student
exports.updateStudent = handleAsync(async (req, res, next) => {
  const student = await studentService.update(req.params.id, req.body);
  if (!student) return next(new ApiError(404, "Student not found"));
  res.json({ success: true, data: student });
});

// Delete student
exports.deleteStudent = handleAsync(async (req, res, next) => {
  const student = await studentService.remove(req.params.id);
  if (!student) return next(new ApiError(404, "Student not found"));
  res.json({ success: true, message: "Student deleted" });
});

// Add a project for a student
exports.addStudentProject = handleAsync(async (req, res, next) => {
  const studentId = req.params.id;
  const projectData = req.body;
  const project = await studentService.addProject(studentId, projectData);
  if (!project)
    return next(new ApiError(404, "Student not found or project not created"));
  return res.status(201).json({ success: true, data: project });
});
// Get student projects
exports.getStudentProjects = handleAsync(async (req, res, next) => {
  const projects = await studentService.getProjects(req.params.id);
  if (!projects) return next(new ApiError(404, "Student not found"));
  return res.json({ success: true, data: projects });
});

// Get student grades
exports.getStudentGrades = handleAsync(async (req, res, next) => {
  const grades = await studentService.getGrades(req.params.id);
  if (!grades) return next(new ApiError(404, "Student not found"));
  return res.json({ success: true, data: grades });
});
