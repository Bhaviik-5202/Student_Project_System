const File = require("../models/file.model");

exports.findAll = (filter = {}) => File.find(filter);
exports.findById = (id) => File.findById(id);
exports.create = (data) => File.create(data);
exports.update = (id, data) => File.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => File.findByIdAndDelete(id);
