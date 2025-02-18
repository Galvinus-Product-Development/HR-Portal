const express = require("express");
const router = express.Router();
const employmentController = require("../controllers/employmentController");
// const validateEmployment = require("../middlewares/validateEmployment");

// Employment Routes
router.post("/",  employmentController.createEmployment);
router.get("/", employmentController.getAllEmployments);
router.get("/:id", employmentController.getEmploymentById);
router.put("/:id",  employmentController.updateEmployment);
router.delete("/:id", employmentController.deleteEmployment);

module.exports = router;
