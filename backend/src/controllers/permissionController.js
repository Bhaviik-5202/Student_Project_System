const Permission = require("../models/Permission");

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().populate("user");
    res.json(permissions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch permissions", error: err.message });
  }
};

// Get permissions by user
exports.getPermissionsByUser = async (req, res) => {
  try {
    const permissions = await Permission.find({ user: req.params.userId });
    res.json(permissions);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch user permissions",
        error: err.message,
      });
  }
};

// Set permission
exports.setPermission = async (req, res) => {
  try {
    const { user, module, canRead, canWrite, canDelete } = req.body;
    let permission = await Permission.findOne({ user, module });
    if (permission) {
      permission.canRead = canRead;
      permission.canWrite = canWrite;
      permission.canDelete = canDelete;
      await permission.save();
    } else {
      permission = new Permission({
        user,
        module,
        canRead,
        canWrite,
        canDelete,
      });
      await permission.save();
    }
    res.status(201).json(permission);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to set permission", error: err.message });
  }
};
