const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activity.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, activityController.createActivity);
router.get("/", auth, activityController.getAllActivities);
router.get("/:id", auth, activityController.getActivityById);
router.put("/:id", auth, activityController.updateActivity);
router.delete("/:id", auth, activityController.deleteActivity);
module.exports = router;
