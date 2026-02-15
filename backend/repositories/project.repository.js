const Project = require("../models/project.model");

exports.findAll = (filter = {}) => Project.find(filter);
exports.findById = (id) => Project.findById(id);
exports.create = (data) => Project.create(data);
exports.update = (id, data) => Project.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Project.findByIdAndDelete(id);
