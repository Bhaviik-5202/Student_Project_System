const Permission = require("../models/permission.model");

exports.findAll = (filter = {}) => Permission.find(filter);
exports.findById = (id) => Permission.findById(id);
exports.create = (data) => Permission.create(data);
exports.update = (id, data) => Permission.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Permission.findByIdAndDelete(id);
