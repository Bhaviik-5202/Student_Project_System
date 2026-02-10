const Staff = require("../models/Staff");

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch staff", error: err.message });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch staff", error: err.message });
  }
};

// Create staff
exports.createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create staff", error: err.message });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update staff", error: err.message });
  }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete staff", error: err.message });
  }
};
