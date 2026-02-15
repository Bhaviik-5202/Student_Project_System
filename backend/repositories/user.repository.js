const User = require("../models/user.model");

exports.findAll = (filter = {}) => User.find(filter);
exports.findById = (id) => User.findById(id);
exports.create = (data) => User.create(data);
exports.update = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => User.findByIdAndDelete(id);
exports.findByEmail = (email) => User.findOne({ email });
