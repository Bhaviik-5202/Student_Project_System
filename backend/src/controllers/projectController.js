const Project = require("../models/Project");
const Student = require("../models/Student");

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("members guide");
    res.json(projects);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch projects", error: err.message });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members guide",
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch project", error: err.message });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create project", error: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update project", error: err.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete project", error: err.message });
  }
};

// Get project members
exports.getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project.members);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch project members", error: err.message });
  }
};

// Add member to project
exports.addProjectMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    const student = await Student.findById(req.body.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!project.members.includes(student._id)) {
      project.members.push(student._id);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to add member", error: err.message });
  }
};
