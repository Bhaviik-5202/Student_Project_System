const Activity = require("../models/activity.model");

exports.findAll = (filter = {}, options = {}) =>
  Activity.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Activity.findById(id).populate(options.populate || "");

exports.create = (data) => Activity.create(data);

exports.update = (id, data) =>
  Activity.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Activity.findByIdAndDelete(id);
