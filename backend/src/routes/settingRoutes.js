const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");

// GET /api/settings
router.get("/", settingController.getAllSettings);
// GET /api/settings/:key
router.get("/:key", settingController.getSettingByKey);
// POST /api/settings
router.post("/", settingController.saveSetting);

module.exports = router;
