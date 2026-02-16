const Assignment = require("../models/assignment.model");

exports.findAll = (filter = {}, options = {}) =>
  Assignment.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Assignment.findById(id).populate(options.populate || "");

exports.create = (data) => Assignment.create(data);

exports.update = (id, data) =>
  Assignment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Assignment.findByIdAndDelete(id);
