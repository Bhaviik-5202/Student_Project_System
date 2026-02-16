const Submission = require("../models/submission.model");

exports.findAll = (filter = {}, options = {}) =>
  Submission.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Submission.findById(id).populate(options.populate || "");

exports.create = (data) => Submission.create(data);

exports.update = (id, data) =>
  Submission.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Submission.findByIdAndDelete(id);
