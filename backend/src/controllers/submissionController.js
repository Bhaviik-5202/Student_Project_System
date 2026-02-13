const Submission = require("../models/Submission");
const ApiError = require("../utils/ApiError");
const handleAsync = require("../utils/handleAsync");

// Get all submissions
exports.getAllSubmissions = handleAsync(async (req, res) => {
  const submissions = await Submission.find().populate("student assignment");
  return res.json({ success: true, data: submissions });
});

// Get submission by id
exports.getSubmissionById = handleAsync(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id).populate(
    "student assignment",
  );
  if (!submission) return next(new ApiError(404, "Submission not found"));
  return res.json({ success: true, data: submission });
});

// Update submission by id
exports.updateSubmission = handleAsync(async (req, res, next) => {
  const submission = await Submission.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!submission) return next(new ApiError(404, "Submission not found"));
  return res.json({ success: true, data: submission });
});

// Delete submission by id
exports.deleteSubmission = handleAsync(async (req, res, next) => {
  const submission = await Submission.findByIdAndDelete(req.params.id);
  if (!submission) return next(new ApiError(404, "Submission not found"));
  return res.json({ success: true, message: "Submission deleted" });
});

// Create submission
exports.createSubmission = handleAsync(async (req, res, next) => {
  const { student, assignment, fileUrl, grade, feedback } = req.body;
  if (!student || !assignment || !fileUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  const submission = await Submission.create({
    student,
    assignment,
    fileUrl,
    grade,
    feedback,
  });
  return res.status(201).json({ success: true, data: submission });
});
