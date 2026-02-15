const Meeting = require("../models/meeting.model");

exports.findAll = (filter = {}) => Meeting.find(filter);
exports.findById = (id) => Meeting.findById(id);
exports.create = (data) => Meeting.create(data);
exports.update = (id, data) => Meeting.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Meeting.findByIdAndDelete(id);
