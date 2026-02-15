const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Register
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
// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  authController.login,
);
// Dummy forgot/reset password for demo
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
