const express = require("express");
const { body, param } = require("express-validator");

const auth = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");
const messageController = require("../controllers/message.controller");

const router = express.Router();

/**
 * POST /api/v1/messages
 */
router.post(
  "/",
  auth,
  [
    body("chatId").isMongoId().withMessage("Valid chat ID is required"),
    body("content").notEmpty().withMessage("Message content is required"),
  ],
  validateRequest,
  messageController.sendMessage,
);

/**
 * GET /api/v1/messages/:chatId
 */
router.get(
  "/:chatId",
  auth,
  [param("chatId").isMongoId().withMessage("Invalid Chat ID")],
  validateRequest,
  messageController.getMessagesByChat,
);

/**
 * DELETE /api/v1/messages/:messageId
 */
router.delete(
  "/:messageId",
  auth,
  [param("messageId").isMongoId().withMessage("Invalid Message ID")],
  validateRequest,
  messageController.deleteMessage,
);

module.exports = router;
