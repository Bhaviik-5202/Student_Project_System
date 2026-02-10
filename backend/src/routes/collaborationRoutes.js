const express = require("express");
const router = express.Router();
const collaborationController = require("../controllers/collaborationController");

// GET /api/collaboration/chats/:userId
router.get("/chats/:userId", collaborationController.getUserChats);
// GET /api/collaboration/messages/:chatId
router.get("/messages/:chatId", collaborationController.getChatMessages);
// POST /api/collaboration/messages/:chatId
router.post("/messages/:chatId", collaborationController.sendMessage);
// POST /api/collaboration/group
router.post("/group", collaborationController.createGroupChat);
// POST /api/collaboration/files
router.post("/files", collaborationController.uploadFile);
// GET /api/collaboration/files/:chatId
router.get("/files/:chatId", collaborationController.getChatFiles);

module.exports = router;
