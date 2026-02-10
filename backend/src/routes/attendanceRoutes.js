const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// GET /api/attendance
router.get("/", attendanceController.getAllAttendance);
// GET /api/attendance/:id
router.get("/:id", attendanceController.getAttendanceByStudent);
// POST /api/attendance
router.post("/", attendanceController.markAttendance);

module.exports = router;
