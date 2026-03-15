/**
 * FAQ Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for FAQs.
 * All routes require authentication.
 */

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

// Controller
const faqController = require("../controllers/faq.controller");

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/faqs
 * @desc    Create a new FAQ
 * @access  Private (Admin)
 */
router.post("/", authMiddleware, faqController.createFAQ);

/**
 * @route   GET /api/v1/faqs
 * @desc    Retrieve all FAQs
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, faqController.getAllFAQs);

/**
 * @route   GET /api/v1/faqs/:id
 * @desc    Retrieve a specific FAQ by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, faqController.getFAQById);

/**
 * @route   PUT /api/v1/faqs/:id
 * @desc    Update an existing FAQ
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authMiddleware,
  [
    body("question").optional().notEmpty().withMessage("Question cannot be empty"),
    body("answer").optional().notEmpty().withMessage("Answer cannot be empty"),
  ],
  validateRequest,
  faqController.updateFAQ
);

/**
 * @route   DELETE /api/v1/faqs/:id
 * @desc    Delete a FAQ
 * @access  Private (Admin)
 */
router.delete("/:id", authMiddleware, faqController.deleteFAQ);

module.exports = router;