const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create project (protected)
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("status")
      .optional()
      .isIn(["planning", "in_progress", "completed", "on_hold", "cancelled"])
      .withMessage("Invalid status"),
  ],
  validateRequest,
  projectController.createProject,
);
// Create project (protected, admin/faculty only)
router.post(
  "/",
  auth,
  roleMiddleware(["admin", "faculty"]),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("status")
      .optional()
      .isIn(["planning", "in_progress", "completed", "on_hold", "cancelled"])
      .withMessage("Invalid status"),
  ],
  validateRequest,
  projectController.createProject,
);
// Get all projects (protected)
router.get("/", auth, projectController.getAllProjects);
// Get project by ID (protected)
router.get("/:id", auth, projectController.getProjectById);
// Update project (protected)
router.put(
  ":id",
  auth,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().isString(),
    body("status")
      .optional()
      .isIn(["planning", "in_progress", "completed", "on_hold", "cancelled"])
      .withMessage("Invalid status"),
  ],
  validateRequest,
  projectController.updateProject,
);
// Update project (protected, admin/faculty only)
router.put(
  ":id",
  auth,
  roleMiddleware(["admin", "faculty"]),
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().isString(),
    body("status")
      .optional()
      .isIn(["planning", "in_progress", "completed", "on_hold", "cancelled"])
      .withMessage("Invalid status"),
  ],
  validateRequest,
  projectController.updateProject,
);
// Delete project (protected)
router.delete("/:id", auth, projectController.deleteProject);
// Delete project (protected, admin/faculty only)
router.delete(
  "/:id",
  auth,
  roleMiddleware(["admin", "faculty"]),
  projectController.deleteProject,
);

module.exports = router;
