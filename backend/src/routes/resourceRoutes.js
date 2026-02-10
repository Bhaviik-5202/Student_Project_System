const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

// GET /api/resources
router.get("/", resourceController.getAllResources);
// GET /api/resources/:id
router.get("/:id", resourceController.getResourceById);
// POST /api/resources
router.post("/", resourceController.uploadResource);
// DELETE /api/resources/:id
router.delete("/:id", resourceController.deleteResource);

module.exports = router;
