/**
 * Support Ticket Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for support tickets.
 * All routes require authentication.
 */

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

// Controller
const supportTicketController = require("../controllers/supportticket.controller");

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/supporttickets
 * @desc    Create a new support ticket
 * @access  Private (Authenticated Users)
 */
router.post("/", authMiddleware, supportTicketController.createSupportTicket);

/**
 * @route   GET /api/v1/supporttickets
 * @desc    Retrieve all support tickets
 * @access  Private (Admin, Support)
 */
router.get("/", authMiddleware, supportTicketController.getAllSupportTickets);

/**
 * @route   GET /api/v1/supporttickets/:id
 * @desc    Retrieve a specific support ticket by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, supportTicketController.getSupportTicketById);

/**
 * @route   PUT /api/v1/supporttickets/:id
 * @desc    Update an existing support ticket
 * @access  Private (Admin, Support)
 */
router.put(
  "/:id",
  authMiddleware,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
  ],
  validateRequest,
  supportTicketController.updateSupportTicket
);

/**
 * @route   DELETE /api/v1/supporttickets/:id
 * @desc    Delete a support ticket
 * @access  Private (Admin, Support)
 */
router.delete("/:id", authMiddleware, supportTicketController.deleteSupportTicket);

module.exports = router;