const Backup = require("../models/Backup");

exports.findAll = async () => {
  return Backup.find().populate("createdBy").sort({ createdAt: -1 });
};

exports.create = async (data) => {
  const backup = new Backup(data);
  return backup.save();
};

exports.remove = async (id) => {
  return Backup.findByIdAndDelete(id);
};
