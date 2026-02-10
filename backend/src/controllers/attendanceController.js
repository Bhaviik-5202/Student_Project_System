const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("student");
    res.json(records);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch attendance", error: err.message });
  }
};

// Get attendance by student ID
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.id }).populate(
      "student",
    );
    res.json(records);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch attendance", error: err.message });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const attendance = new Attendance({ student: studentId, date, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to mark attendance", error: err.message });
  }
};
