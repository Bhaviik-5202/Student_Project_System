const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// GET /api/projects
router.get("/", projectController.getAllProjects);
// GET /api/projects/:id
router.get("/:id", projectController.getProjectById);
// POST /api/projects
router.post("/", projectController.createProject);
// PUT /api/projects/:id
router.put("/:id", projectController.updateProject);
// DELETE /api/projects/:id
router.delete("/:id", projectController.deleteProject);
// GET /api/projects/:id/members
router.get("/:id/members", projectController.getProjectMembers);
// POST /api/projects/:id/members
router.post("/:id/members", projectController.addProjectMember);

module.exports = router;
