const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");

// Mark attendance (protected)
router.post(
  "/",
  auth,
  [
    body("student").notEmpty().withMessage("Student is required"),
    body("date")
      .notEmpty()
      .isISO8601()
      .withMessage("Date must be a valid ISO8601 date"),
    body("status")
      .notEmpty()
      .isIn(["present", "absent", "late", "excused"])
      .withMessage("Status must be present, absent, late, or excused"),
  ],
  validateRequest,
  attendanceController.markAttendance,
);
// Get all attendance records (protected)
router.get("/", auth, attendanceController.getAllAttendance);
// Get attendance by student ID (protected)
router.get(
  "/student/:studentId",
  auth,
  attendanceController.getAttendanceByStudent,
);

module.exports = router;
