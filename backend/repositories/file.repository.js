const File = require("../models/file.model");

exports.findAll = (filter = {}, options = {}) =>
  File.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  File.findById(id).populate(options.populate || "");

exports.create = (data) => File.create(data);

exports.update = (id, data) =>
  File.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => File.findByIdAndDelete(id);
