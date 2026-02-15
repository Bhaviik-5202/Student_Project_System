const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submission.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, submissionController.createSubmission);
router.get("/", auth, submissionController.getAllSubmissions);
router.get("/:id", auth, submissionController.getSubmissionById);
router.put("/:id", auth, submissionController.updateSubmission);
router.delete("/:id", auth, submissionController.deleteSubmission);
module.exports = router;
