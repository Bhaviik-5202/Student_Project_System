const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const assignmentController = require("../controllers/assignment.controller");
const auth = require("../middleware/auth.middleware");

// Create assignment (protected)
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("dueDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Due date must be a valid date"),
  ],
  assignmentController.createAssignment,
);
// Get all assignments (protected)
router.get("/", auth, assignmentController.getAllAssignments);
// Get assignment by ID (protected)
router.get("/:id", auth, assignmentController.getAssignmentById);
// Update assignment (protected)
router.put(
  "/:id",
  auth,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().isString(),
    body("dueDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Due date must be a valid date"),
  ],
  assignmentController.updateAssignment,
);
// Delete assignment (protected)
router.delete("/:id", auth, assignmentController.deleteAssignment);

module.exports = router;
