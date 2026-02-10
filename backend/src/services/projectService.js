const Project = require("../models/Project");
const Student = require("../models/Student");

exports.findAll = async (filter = {}) => {
  return Project.find(filter).populate("members guide");
};

exports.findById = async (id) => {
  return Project.findById(id).populate("members guide");
};

exports.create = async (data) => {
  const project = new Project(data);
  return project.save();
};

exports.update = async (id, data) => {
  return Project.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Project.findByIdAndDelete(id);
};

exports.getMembers = async (id) => {
  const project = await Project.findById(id).populate("members");
  return project ? project.members : null;
};

exports.addMember = async (id, studentId) => {
  const project = await Project.findById(id);
  if (!project) return null;
  const student = await Student.findById(studentId);
  if (!student) return null;
  if (!project.members.includes(student._id)) {
    project.members.push(student._id);
    await project.save();
  }
  return project;
};
