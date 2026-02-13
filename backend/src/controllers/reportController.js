const Student = require("../models/Student");
const Project = require("../models/Project");
const Assignment = require("../models/Assignment");

const ApiError = require("../utils/ApiError");

// Generate student report
exports.getStudentReport = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "projects grades.project",
    );
    if (!student) return next(new ApiError(404, "Student not found"));
    return res.json({ success: true, data: student });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch student report", [err.message]),
    );
  }
};

// Generate project report
exports.getProjectReport = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members guide",
    );
    if (!project) return next(new ApiError(404, "Project not found"));
    return res.json({ success: true, data: project });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch project report", [err.message]),
    );
  }
};

// Generate assignment report
exports.getAssignmentReport = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "course submissions",
    );
    if (!assignment) return next(new ApiError(404, "Assignment not found"));
    return res.json({ success: true, data: assignment });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch assignment report", [err.message]),
    );
  }
};
