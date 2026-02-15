const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();
const resourceController = require("../controllers/resource.controller");
const auth = require("../middleware/auth.middleware");

// Create resource (protected)
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("type")
      .notEmpty()
      .isIn(["document", "template", "video"])
      .withMessage("Type must be document, template, or video"),
    body("description").optional().isString(),
    body("url").optional().isString(),
  ],
  validateRequest,
  resourceController.createResource,
);
// Get all resources (protected)
router.get("/", auth, resourceController.getAllResources);
// Get resource by ID (protected)
router.get("/:id", auth, resourceController.getResourceById);
// Delete resource (protected)
router.delete("/:id", auth, resourceController.deleteResource);

module.exports = router;
