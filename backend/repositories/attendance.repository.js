const Attendance = require("../models/attendance.model");

exports.findAll = (filter = {}, options = {}) =>
  Attendance.find(filter)
    .sort(options.sort || { date: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Attendance.findById(id).populate(options.populate || "");

exports.create = (data) => Attendance.create(data);

exports.update = (id, data) =>
  Attendance.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Attendance.findByIdAndDelete(id);
