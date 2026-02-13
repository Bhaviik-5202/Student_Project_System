const Staff = require("../models/Staff");
const ApiError = require("../utils/ApiError");
const handleAsync = require("../utils/handleAsync");

// Get all staff
exports.getAllStaff = handleAsync(async (req, res) => {
  const staff = await Staff.find();
  return res.json({ success: true, data: staff });
});

// Get staff by ID
exports.getStaffById = handleAsync(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return next(new ApiError(404, "Staff not found"));
  return res.json({ success: true, data: staff });
});

// Create staff
exports.createStaff = handleAsync(async (req, res) => {
  const staff = new Staff(req.body);
  await staff.save();
  return res.status(201).json({ success: true, data: staff });
});

// Update staff
exports.updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!staff) return next(new ApiError(404, "Staff not found"));
    return res.json({ success: true, data: staff });
  } catch (err) {
    return next(new ApiError(400, "Failed to update staff", [err.message]));
  }
};

// Delete staff
exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return next(new ApiError(404, "Staff not found"));
    return res.json({ success: true, message: "Staff deleted" });
  } catch (err) {
    return next(new ApiError(500, "Failed to delete staff", [err.message]));
  }
};
