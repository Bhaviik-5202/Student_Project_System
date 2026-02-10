const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// GET /api/profile/:id
router.get("/:id", profileController.getProfile);
// PUT /api/profile/:id
router.put("/:id", profileController.updateProfile);

module.exports = router;
