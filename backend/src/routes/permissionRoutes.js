const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");

// GET /api/permissions
router.get("/", permissionController.getAllPermissions);
// GET /api/permissions/user/:userId
router.get("/user/:userId", permissionController.getPermissionsByUser);
// POST /api/permissions
router.post("/", permissionController.setPermission);

module.exports = router;
