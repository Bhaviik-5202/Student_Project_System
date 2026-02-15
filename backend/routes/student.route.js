const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const auth = require("../middleware/auth.middleware");

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("rollNumber").notEmpty().withMessage("Roll number is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("year")
      .isInt({ min: 1 })
      .withMessage("Year must be a positive integer"),
  ],
  studentController.createStudent,
);

router.get("/", auth, studentController.getAllStudents);
router.get("/:id", auth, studentController.getStudentById);

router.put(
  ":id",
  auth,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("rollNumber")
      .optional()
      .notEmpty()
      .withMessage("Roll number cannot be empty"),
    body("department")
      .optional()
      .notEmpty()
      .withMessage("Department cannot be empty"),
    body("year")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Year must be a positive integer"),
  ],
  studentController.updateStudent,
);

router.delete("/:id", auth, studentController.deleteStudent);
module.exports = router;
