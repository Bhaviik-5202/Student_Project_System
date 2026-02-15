const Student = require("../models/student.model");

exports.findAll = (filter = {}) => Student.find(filter);
exports.findById = (id) => Student.findById(id);
exports.create = (data) => Student.create(data);
exports.update = (id, data) => Student.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Student.findByIdAndDelete(id);
