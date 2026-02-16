/**
 * Resource Routes
 * ------------------------------------------------------------------
 * Handles resource management (documents, templates, videos).
 * All routes are protected via authentication middleware.
 */

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

// Controller
const resourceController = require("../controllers/resource.controller");

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/resources
 * @desc    Create a new resource
 * @access  Private (Authenticated Users)
 */
router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),

    body("type")
      .notEmpty()
      .isIn(["document", "template", "video"])
      .withMessage("Type must be document, template, or video"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    body("url").optional().isString().withMessage("URL must be a string"),
  ],
  validateRequest,
  resourceController.createResource,
);

/**
 * @route   GET /api/v1/resources
 * @desc    Retrieve all resources
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, resourceController.getAllResources);

/**
 * @route   GET /api/v1/resources/:id
 * @desc    Retrieve a specific resource by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, resourceController.getResourceById);

/**
 * @route   DELETE /api/v1/resources/:id
 * @desc    Delete a resource
 * @access  Private (Authenticated Users)
 */
router.delete("/:id", authMiddleware, resourceController.deleteResource);

module.exports = router;
