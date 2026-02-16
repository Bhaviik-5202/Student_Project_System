const Setting = require("../models/setting.model");

exports.findAll = (filter = {}, options = {}) =>
  Setting.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0);

exports.findById = (id) => Setting.findById(id);

exports.create = (data) => Setting.create(data);

exports.update = (id, data) =>
  Setting.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Setting.findByIdAndDelete(id);
