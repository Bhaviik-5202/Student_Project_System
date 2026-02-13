const Permission = require("../models/Permission");

exports.findAll = async () => {
  return Permission.find().populate("user");
};

exports.findByUser = async (userId) => {
  return Permission.find({ user: userId });
};

exports.set = async (data) => {
  const { user, module, canRead, canWrite, canDelete } = data;
  let permission = await Permission.findOne({ user, module });
  if (permission) {
    permission.canRead = canRead;
    permission.canWrite = canWrite;
    permission.canDelete = canDelete;
    await permission.save();
  } else {
    permission = new Permission({ user, module, canRead, canWrite, canDelete });
    await permission.save();
  }
  return permission;
};
