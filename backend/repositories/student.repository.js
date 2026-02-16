const Student = require("../models/student.model");

exports.findAll = (filter = {}, options = {}) =>
  Student.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Student.findById(id).populate(options.populate || "");

exports.create = (data) => Student.create(data);

exports.update = (id, data) =>
  Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Student.findByIdAndDelete(id);
