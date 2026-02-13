const Attendance = require("../models/Attendance");

exports.findAll = async () => Attendance.find().populate("student");
exports.findByStudent = async (studentId) =>
  Attendance.find({ student: studentId }).populate("student");
exports.create = async (data) => {
  const attendance = new Attendance(data);
  return attendance.save();
};
