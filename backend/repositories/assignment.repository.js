const Assignment = require("../models/assignment.model");

exports.findAll = (filter = {}) => Assignment.find(filter);
exports.findById = (id) => Assignment.findById(id);
exports.create = (data) => Assignment.create(data);
exports.update = (id, data) => Assignment.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Assignment.findByIdAndDelete(id);
