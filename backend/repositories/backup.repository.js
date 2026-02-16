const Backup = require("../models/backup.model");

exports.findAll = (filter = {}, options = {}) =>
  Backup.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Backup.findById(id).populate(options.populate || "");

exports.create = (data) => Backup.create(data);

exports.update = (id, data) =>
  Backup.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Backup.findByIdAndDelete(id);
