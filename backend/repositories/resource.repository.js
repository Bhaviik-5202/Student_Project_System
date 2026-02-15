const Resource = require("../models/resource.model");

exports.findAll = (filter = {}) => Resource.find(filter);
exports.findById = (id) => Resource.findById(id);
exports.create = (data) => Resource.create(data);
exports.update = (id, data) => Resource.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Resource.findByIdAndDelete(id);
