const Project = require("../models/project.model");

exports.findAll = (filter = {}, options = {}) =>
  Project.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Project.findById(id).populate(options.populate || "");

exports.create = (data) => Project.create(data);

exports.update = (id, data) =>
  Project.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Project.findByIdAndDelete(id);
