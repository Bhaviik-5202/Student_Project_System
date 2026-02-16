const User = require("../models/user.model");

exports.findAll = (filter = {}, options = {}) =>
  User.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "")
    .select(options.select || "");

exports.findById = (id, options = {}) =>
  User.findById(id)
    .populate(options.populate || "")
    .select(options.select || "");

exports.create = (data) => User.create(data);

exports.update = (id, data) =>
  User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => User.findByIdAndDelete(id);

exports.findByEmail = (email, options = {}) =>
  User.findOne({ email })
    .populate(options.populate || "")
    .select(options.select || "");
