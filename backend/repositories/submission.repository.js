const Submission = require("../models/submission.model");

exports.findAll = (filter = {}) => Submission.find(filter);
exports.findById = (id) => Submission.findById(id);
exports.create = (data) => Submission.create(data);
exports.update = (id, data) => Submission.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Submission.findByIdAndDelete(id);
