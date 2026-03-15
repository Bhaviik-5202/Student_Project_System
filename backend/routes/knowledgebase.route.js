/**
 * Knowledge Base Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for knowledge base articles.
 * All routes require authentication.
 */

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

// Controller
const knowledgeBaseController = require("../controllers/knowledgebase.controller");

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/knowledgebase
 * @desc    Create a new knowledge base article
 * @access  Private (Admin, Faculty)
 */
router.post("/", authMiddleware, knowledgeBaseController.createKnowledgeBase);

/**
 * @route   GET /api/v1/knowledgebase
 * @desc    Retrieve all knowledge base articles
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, knowledgeBaseController.getAllKnowledgeBases);

/**
 * @route   GET /api/v1/knowledgebase/:id
 * @desc    Retrieve a specific knowledge base article by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, knowledgeBaseController.getKnowledgeBaseById);

/**
 * @route   PUT /api/v1/knowledgebase/:id
 * @desc    Update an existing knowledge base article
 * @access  Private (Admin, Faculty)
 */
router.put(
  "/:id",
  authMiddleware,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("content").optional().notEmpty().withMessage("Content cannot be empty"),
  ],
  validateRequest,
  knowledgeBaseController.updateKnowledgeBase
);

/**
 * @route   DELETE /api/v1/knowledgebase/:id
 * @desc    Delete a knowledge base article
 * @access  Private (Admin, Faculty)
 */
router.delete("/:id", authMiddleware, knowledgeBaseController.deleteKnowledgeBase);

module.exports = router;