const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// POST /api/users
router.post("/", userController.createUser);
// GET /api/users
router.get("/", userController.getAllUsers);
// GET /api/users/:id
router.get("/:id", userController.getUserById);
// PUT /api/users/:id
router.put("/:id", userController.updateUser);
// DELETE /api/users/:id
router.delete("/:id", userController.deleteUser);

module.exports = router;
