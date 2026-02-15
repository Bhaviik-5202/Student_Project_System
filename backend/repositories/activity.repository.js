const Activity = require("../models/activity.model");

exports.findAll = (filter = {}) => Activity.find(filter);
exports.findById = (id) => Activity.findById(id);
exports.create = (data) => Activity.create(data);
exports.update = (id, data) => Activity.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Activity.findByIdAndDelete(id);
