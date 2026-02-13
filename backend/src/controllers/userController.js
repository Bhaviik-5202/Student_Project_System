const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const handleAsync = require("../utils/handleAsync");

// Create user
exports.createUser = handleAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  // Basic validation (can be extended)
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  // Check for existing user
  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Email already exists" });
  }
  const user = await User.create({ name, email, password, role });
  return res.status(201).json({ success: true, data: user });
});
// Get all users
exports.getAllUsers = handleAsync(async (req, res) => {
  const users = await User.find();
  return res.json({ success: true, data: users });
});

// Get user by ID
exports.getUserById = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError(404, "User not found"));
  return res.json({ success: true, data: user });
});

// Update user
exports.updateUser = handleAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) return next(new ApiError(404, "User not found"));
  return res.json({ success: true, data: user });
});

// Delete user
exports.deleteUser = handleAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new ApiError(404, "User not found"));
  return res.json({ success: true, message: "User deleted" });
});
