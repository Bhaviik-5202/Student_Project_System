const User = require("../models/User");

exports.findAll = async (filter = {}) => {
  return User.find(filter);
};

exports.findById = async (id) => {
  return User.findById(id);
};

exports.create = async (data) => {
  const user = new User(data);
  return user.save();
};

exports.update = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return User.findByIdAndDelete(id);
};
