const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("course");
    res.json(assignments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch assignments", error: err.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
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
      .json({ message: "Failed to fetch assignment", error: err.message });
  }
};

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create assignment", error: err.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update assignment", error: err.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete assignment", error: err.message });
  }
};

// Get assignment submissions
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate({
      path: "submissions",
      populate: { path: "student" },
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment.submissions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch submissions", error: err.message });
  }
};
