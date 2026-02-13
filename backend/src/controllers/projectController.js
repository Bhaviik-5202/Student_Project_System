const projectService = require("../services/projectService");
const ApiError = require("../utils/ApiError");
const Project = require("../models/Project");
const Student = require("../models/Student");

// Get all projects
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.findAll();
    return res.json({ success: true, data: projects });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch projects", [err.message]));
  }
};

// Get project by ID
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.findById(req.params.id);
    if (!project) return next(new ApiError(404, "Project not found"));
    return res.json({ success: true, data: project });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch project", [err.message]));
  }
};

// Create project
exports.createProject = async (req, res, next) => {
  try {
    const project = await projectService.create(req.body);
    return res.status(201).json({ success: true, data: project });
  } catch (err) {
    return next(new ApiError(400, "Failed to create project", [err.message]));
  }
};

// Update project
exports.updateProject = async (req, res, next) => {
  try {
    const project = await projectService.update(req.params.id, req.body);
    if (!project) return next(new ApiError(404, "Project not found"));
    return res.json({ success: true, data: project });
  } catch (err) {
    return next(new ApiError(400, "Failed to update project", [err.message]));
  }
};

// Delete project
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return next(new ApiError(404, "Project not found"));
    return res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    return next(new ApiError(500, "Failed to delete project", [err.message]));
  }
};

// Get project members
exports.getProjectMembers = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("members");
    if (!project) return next(new ApiError(404, "Project not found"));
    return res.json({ success: true, data: project.members });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch project members", [err.message]),
    );
  }
};

// Add member to project
exports.addProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new ApiError(404, "Project not found"));
    const student = await Student.findById(req.body.studentId);
    if (!student) return next(new ApiError(404, "Student not found"));
    if (!project.members.includes(student._id)) {
      project.members.push(student._id);
      await project.save();
    }
    return res.json({ success: true, data: project });
  } catch (err) {
    return next(new ApiError(400, "Failed to add member", [err.message]));
  }
};
