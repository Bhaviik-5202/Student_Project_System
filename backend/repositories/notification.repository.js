const Notification = require("../models/notification.model");

exports.findAll = (filter = {}) => Notification.find(filter);
exports.findById = (id) => Notification.findById(id);
exports.create = (data) => Notification.create(data);
exports.update = (id, data) => Notification.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Notification.findByIdAndDelete(id);
