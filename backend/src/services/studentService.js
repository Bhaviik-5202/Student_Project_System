const Project = require("../models/Project");
// Add a project for a student
exports.addProject = async (studentId, projectData) => {
  // Find the student
  const student = await Student.findById(studentId);
  if (!student) return null;
  // Create the project with the student as a member
  const project = await Project.create({
    ...projectData,
    members: [studentId],
  });
  // Add project to student's projects array
  student.projects.push(project._id);
  await student.save();
  return project;
};
const Student = require("../models/Student");

exports.findAll = async (filter = {}) => {
  return Student.find(filter).populate("projects");
};

exports.findById = async (id) => {
  return Student.findById(id).populate("projects");
};

exports.create = async (data) => {
  const student = new Student(data);
  return student.save();
};

exports.update = async (id, data) => {
  return Student.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Student.findByIdAndDelete(id);
};

exports.getProjects = async (id) => {
  const student = await Student.findById(id).populate("projects");
  return student ? student.projects : null;
};

exports.getGrades = async (id) => {
  const student = await Student.findById(id).populate("grades.project");
  return student ? student.grades : null;
};
