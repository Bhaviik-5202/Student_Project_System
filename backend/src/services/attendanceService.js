const Attendance = require("../models/Attendance");

exports.findAll = async (filter = {}) => {
  return Attendance.find(filter).populate("student");
};

exports.findByStudent = async (studentId) => {
  return Attendance.find({ student: studentId }).populate("student");
};

exports.create = async (data) => {
  const attendance = new Attendance(data);
  return attendance.save();
};

exports.update = async (id, data) => {
  return Attendance.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Attendance.findByIdAndDelete(id);
};
