const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();
const resourceController = require("../controllers/resource.controller");
const auth = require("../middleware/auth.middleware");

router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("type")
      .notEmpty()
      .isIn(["document", "template", "video"])
      .withMessage("Type must be document, template, or video"),
    body("description").optional().isString(),
    body("url").optional().isString(),
  ],
  validateRequest,
  resourceController.createResource,
);
router.get("/", auth, resourceController.getAllResources);
router.get("/:id", auth, resourceController.getResourceById);
router.delete("/:id", auth, resourceController.deleteResource);

module.exports = router;
