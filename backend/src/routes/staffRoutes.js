const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

// GET /api/staff
router.get("/", staffController.getAllStaff);
// GET /api/staff/:id
router.get("/:id", staffController.getStaffById);
// POST /api/staff
router.post("/", staffController.createStaff);
// PUT /api/staff/:id
router.put("/:id", staffController.updateStaff);
// DELETE /api/staff/:id
router.delete("/:id", staffController.deleteStaff);

module.exports = router;
