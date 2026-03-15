/**
 * Setting Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for settings.
 * All routes require authentication.
 */

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

// Controller
const settingController = require("../controllers/setting.controller");

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/settings
 * @desc    Create a new setting
 * @access  Private (Admin)
 */
router.post("/", authMiddleware, settingController.createSetting);

/**
 * @route   GET /api/v1/settings
 * @desc    Retrieve all settings
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, settingController.getAllSettings);

/**
 * @route   GET /api/v1/settings/:id
 * @desc    Retrieve a specific setting by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, settingController.getSettingById);

/**
 * @route   PUT /api/v1/settings/:id
 * @desc    Update an existing setting
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authMiddleware,
  [
    body("key").optional().notEmpty().withMessage("Key cannot be empty"),
    body("value").optional().exists().withMessage("Value is required"),
  ],
  validateRequest,
  settingController.updateSetting
);

/**
 * @route   DELETE /api/v1/settings/:id
 * @desc    Delete a setting
 * @access  Private (Admin)
 */
router.delete("/:id", authMiddleware, settingController.deleteSetting);

module.exports = router;