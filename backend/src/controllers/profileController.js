const userService = require("../services/userService");
const ApiError = require("../utils/ApiError");

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return next(new ApiError(404, "User not found"));
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch user profile", [err.message]),
    );
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return next(new ApiError(404, "User not found"));
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to update user profile", [err.message]),
    );
  }
};
