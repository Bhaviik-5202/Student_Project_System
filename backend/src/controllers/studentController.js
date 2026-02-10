const studentService = require("../services/studentService");

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await studentService.findAll();
    res.json(students);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: err.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await studentService.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch student", error: err.message });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const student = await studentService.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create student", error: err.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await studentService.update(req.params.id, req.body);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update student", error: err.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await studentService.remove(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete student", error: err.message });
  }
};

// Get student projects
exports.getStudentProjects = async (req, res) => {
  try {
    const projects = await studentService.getProjects(req.params.id);
    if (!projects)
      return res.status(404).json({ message: "Student not found" });
    res.json(projects);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch student projects",
        error: err.message,
      });
  }
};

// Get student grades
exports.getStudentGrades = async (req, res) => {
  try {
    const grades = await studentService.getGrades(req.params.id);
    if (!grades) return res.status(404).json({ message: "Student not found" });
    res.json(grades);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch student grades", error: err.message });
  }
};
