/**
 * Authentication Routes
 * ------------------------------------------------------------------
 * Handles user authentication and authorization processes.
 */

const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

// Controllers and Middlewares
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),

    body("email").isEmail().withMessage("Valid email is required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role")
      .optional()
      .isIn(["admin", "faculty", "student"])
      .withMessage("Invalid role"),
  ],
  validateRequest,
  authController.register,
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  authController.login,
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Handle forgot password request
 * @access  Public
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset user password
 * @access  Public
 */
router.post("/reset-password", authController.resetPassword);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authMiddleware, authController.getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put("/profile", authMiddleware, authController.updateProfile);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
