const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const { body } = require("express-validator");

// Create user (protected)
router.post("/", auth, userController.createUser);
// Get all users (protected)
router.get("/", auth, userController.getAllUsers);
// Get user by ID (protected)
router.get("/:id", auth, userController.getUserById);
// Update user (protected)
router.put("/:id", auth, userController.updateUser);
router.put(
  ":id",
  auth,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["admin", "faculty", "student"])
      .withMessage("Invalid role"),
  ],
  userController.updateUser,
);
// Delete user (protected)
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
