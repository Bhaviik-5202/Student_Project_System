const Timeline = require("../models/timeline.model");

exports.findAll = (filter = {}, options = {}) =>
  Timeline.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Timeline.findById(id).populate(options.populate || "");

exports.create = (data) => Timeline.create(data);

exports.update = (id, data) =>
  Timeline.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Timeline.findByIdAndDelete(id);
