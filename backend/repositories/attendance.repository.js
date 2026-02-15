const Attendance = require("../models/attendance.model");

exports.findAll = (filter = {}) => Attendance.find(filter);
exports.findById = (id) => Attendance.findById(id);
exports.create = (data) => Attendance.create(data);
exports.update = (id, data) => Attendance.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Attendance.findByIdAndDelete(id);
