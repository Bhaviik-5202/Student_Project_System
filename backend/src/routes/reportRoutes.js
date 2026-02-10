const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// GET /api/reports/student/:id
router.get("/student/:id", reportController.getStudentReport);
// GET /api/reports/project/:id
router.get("/project/:id", reportController.getProjectReport);
// GET /api/reports/assignment/:id
router.get("/assignment/:id", reportController.getAssignmentReport);

module.exports = router;
