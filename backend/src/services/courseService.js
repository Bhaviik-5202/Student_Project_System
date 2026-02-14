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

exports.enrollStudent = async (courseId, studentId) => {
  const course = await Course.findById(courseId);
  const student = await Student.findById(studentId);
  if (!course || !student) return null;
  if (!course.students.includes(student._id)) {
    course.students.push(student._id);
    await course.save();
  }
  return course;
};

exports.addAssignment = async (courseId, assignmentData) => {
  const course = await Course.findById(courseId);
  if (!course) return null;
  const assignment = new Assignment({ ...assignmentData, course: course._id });
  await assignment.save();
  course.assignments.push(assignment._id);
  await course.save();
  return assignment;
};

exports.removeAssignment = async (courseId, assignmentId) => {
  const course = await Course.findById(courseId);
  if (!course) return null;
  course.assignments.pull(assignmentId);
  await course.save();
  return Assignment.findByIdAndDelete(assignmentId);
};
