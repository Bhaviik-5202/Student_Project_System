const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Attendance model for MongoDB
module.exports = mongoose.model("Attendance", attendanceSchema);
