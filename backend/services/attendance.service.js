// services/attendance.service.js
const Attendance = require("../models/attendance.model");

exports.markAttendance = async (data) => {
  const attendance = new Attendance(data);
  return await attendance.save();
};

exports.getAllAttendance = async () => {
  return await Attendance.find();
};

exports.getAttendanceByStudent = async (studentId) => {
  return await Attendance.find({ student: studentId });
};
