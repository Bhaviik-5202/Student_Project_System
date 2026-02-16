const Notification = require("../models/notification.model");

exports.findAll = (filter = {}, options = {}) =>
  Notification.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Notification.findById(id).populate(options.populate || "");

exports.create = (data) => Notification.create(data);

exports.update = (id, data) =>
  Notification.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Notification.findByIdAndDelete(id);
