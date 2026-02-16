const Evaluation = require("../models/evaluation.model");
const Evaluation = require("../models/evaluation.model");

exports.findAll = (filter = {}, options = {}) =>
  Evaluation.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Evaluation.findById(id).populate(options.populate || "");

exports.create = (data) => Evaluation.create(data);

exports.update = (id, data) =>
  Evaluation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Evaluation.findByIdAndDelete(id);

exports.findAll = (filter = {}) => Evaluation.find(filter);
exports.findById = (id) => Evaluation.findById(id);
exports.create = (data) => Evaluation.create(data);
exports.update = (id, data) =>
  Evaluation.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Evaluation.findByIdAndDelete(id);
