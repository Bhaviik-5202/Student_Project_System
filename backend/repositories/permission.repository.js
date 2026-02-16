const Permission = require("../models/permission.model");

exports.findAll = (filter = {}, options = {}) =>
  Permission.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Permission.findById(id).populate(options.populate || "");

exports.create = (data) => Permission.create(data);

exports.update = (id, data) =>
  Permission.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Permission.findByIdAndDelete(id);
