const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

exports.findAll = async (filter = {}) => {
  return Course.find(filter).populate("faculty students assignments");
};

exports.findById = async (id) => {
  return Course.findById(id).populate("faculty students assignments");
};

exports.create = async (data) => {
  const course = new Course(data);
  return course.save();
};

exports.update = async (id, data) => {
  return Course.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Course.findByIdAndDelete(id);
};

exports.getAssignments = async (id) => {
  const course = await Course.findById(id).populate("assignments");
  return course ? course.assignments : null;
};

exports.getStudents = async (id) => {
  const course = await Course.findById(id).populate("students");
  return course ? course.students : null;
};
