const Student = require("../models/Student");
const Project = require("../models/Project");
const Assignment = require("../models/Assignment");

// Generate student report
exports.getStudentReport = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "projects grades.project",
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch student report", error: err.message });
  }
};

// Generate project report
exports.getProjectReport = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members guide",
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch project report", error: err.message });
  }
};

// Generate assignment report
exports.getAssignmentReport = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "course submissions",
    );
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch assignment report",
        error: err.message,
      });
  }
};
