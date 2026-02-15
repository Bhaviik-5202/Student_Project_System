const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");

// POST /api/v1/courses
router.post("/", coursesController.createCourse);

module.exports = router;
