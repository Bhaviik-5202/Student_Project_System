const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

// POST /api/submissions
router.post("/", submissionController.createSubmission);
// GET all submissions
router.get("/", submissionController.getAllSubmissions);
// GET submission by id
router.get("/:id", submissionController.getSubmissionById);
// UPDATE submission by id
router.put("/:id", submissionController.updateSubmission);
// DELETE submission by id
router.delete("/:id", submissionController.deleteSubmission);

module.exports = router;
