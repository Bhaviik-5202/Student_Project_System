/**
 * Chat Routes
 * ------------------------------------------------------------------
 * Handles interpersonal and group chat communications.
 */

const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();

// Controllers and Middlewares
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/chats
 * @desc    Create new chat (private or group)
 * @access  Private (Authenticated Users)
 */
router.post(
  "/",
  authMiddleware,
  [
    body("members")
      .isArray({ min: 1 })
      .withMessage("Members must be a non-empty array"),

    body("members.*")
      .isMongoId()
      .withMessage("Each member must be a valid user ID"),

    body("isGroup").optional().isBoolean(),

    body("groupName")
      .if(body("isGroup").equals("true"))
      .notEmpty()
      .withMessage("Group name is required for group chats"),
  ],
  validateRequest,
  chatController.createChat,
);

/**
 * @route   GET /api/v1/chats
 * @desc    Get all chats of logged-in user
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, chatController.getUserChats);

/**
 * @route   GET /api/v1/chats/:chatId
 * @desc    Get a specific chat by ID
 * @access  Private (Authenticated Users)
 */
router.get(
  "/:chatId",
  authMiddleware,
  [param("chatId").isMongoId().withMessage("Invalid Chat ID")],
  validateRequest,
  chatController.getChatById,
);

/**
 * @route   PUT /api/v1/chats/:chatId
 * @desc    Update chat details (e.g., group name, members)
 * @access  Private (Authenticated Users)
 */
router.put(
  "/:chatId",
  authMiddleware,
  [param("chatId").isMongoId().withMessage("Invalid Chat ID")],
  validateRequest,
  chatController.updateChat,
);

/**
 * @route   DELETE /api/v1/chats/:chatId
 * @desc    Delete a chat
 * @access  Private (Authenticated Users)
 */
router.delete(
  "/:chatId",
  authMiddleware,
  [param("chatId").isMongoId().withMessage("Invalid Chat ID")],
  validateRequest,
  chatController.deleteChat,
);

module.exports = router;
