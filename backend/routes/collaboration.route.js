const express = require("express");
const router = express.Router();
const collaborationController = require("../controllers/collaboration.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../utils/upload");

/**
 * Collaboration Router
 * Mounted at /api/v1/collaboration
 */

router.use(authMiddleware);

// --- Discussions ---
router.get("/discussions", collaborationController.getDiscussions);
router.get("/discussions/:id", collaborationController.getDiscussionById);
router.post("/discussions", collaborationController.createDiscussion);
router.post("/discussions/:id/replies", collaborationController.addReply);

// --- Shared Files ---
router.get("/projects/:projectId/files", collaborationController.getSharedFiles);
router.post("/projects/:projectId/files", upload.single("file"), collaborationController.shareFile);
router.delete("/files/:id", collaborationController.deleteSharedFile);

module.exports = router;
