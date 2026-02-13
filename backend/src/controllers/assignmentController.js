const assignmentService = require("../services/assignmentService");
const ApiError = require("../utils/ApiError");
const Assignment = require("../models/Assignment");

// Get all assignments
const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.findAll();
    return res.json({ success: true, data: assignments });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch assignments", [err.message]),
    );
  }
};

// Get assignment by ID
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await assignmentService.findById(req.params.id);
    if (!assignment) return next(new ApiError(404, "Assignment not found"));
    return res.json({ success: true, data: assignment });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch assignment", [err.message]));
  }
};

// Create assignment
const createAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.create(req.body);
    return res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to create assignment", [err.message]),
    );
  }
};

// Update assignment
const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.update(req.params.id, req.body);
    if (!assignment) return next(new ApiError(404, "Assignment not found"));
    return res.json({ success: true, data: assignment });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to update assignment", [err.message]),
    );
  }
};

// Delete assignment
const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.remove(req.params.id);
    if (!assignment) return next(new ApiError(404, "Assignment not found"));
    return res.json({ success: true, message: "Assignment deleted" });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to delete assignment", [err.message]),
    );
  }
};

// Get assignment submissions
const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate({
      path: "submissions",
      populate: { path: "student" },
    });
    if (!assignment) return next(new ApiError(404, "Assignment not found"));
    return res.json({ success: true, data: assignment.submissions });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch submissions", [err.message]),
    );
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
};
