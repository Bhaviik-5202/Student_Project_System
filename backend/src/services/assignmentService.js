const Assignment = require("../models/Assignment");

exports.findAll = async (filter = {}) => {
  return Assignment.find(filter).populate("course");
};

exports.findById = async (id) => {
  return Assignment.findById(id).populate("course submissions");
};

exports.create = async (data) => {
  const assignment = new Assignment(data);
  return assignment.save();
};

exports.update = async (id, data) => {
  return Assignment.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Assignment.findByIdAndDelete(id);
};

exports.getSubmissions = async (id) => {
  const assignment = await Assignment.findById(id).populate({
    path: "submissions",
    populate: { path: "student" },
  });
  return assignment ? assignment.submissions : null;
};

exports.getCourse = async (id) => {
  const assignment = await Assignment.findById(id).populate("course");
  return assignment ? assignment.course : null;
};

exports.submitAssignment = async (assignmentId, data) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) return null;
  assignment.submissions.push(data);
  return assignment.save();
};
