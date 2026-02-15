const Evaluation = require("../models/evaluation.model");

exports.findAll = (filter = {}) => Evaluation.find(filter);
exports.findById = (id) => Evaluation.findById(id);
exports.create = (data) => Evaluation.create(data);
exports.update = (id, data) => Evaluation.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Evaluation.findByIdAndDelete(id);
