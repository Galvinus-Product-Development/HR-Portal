const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");

// Salary Routes
router.post("/", salaryController.createSalary);
router.get("/", salaryController.getAllSalaries);
router.get("/:id", salaryController.getSalaryById);
router.put("/:id", salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);

module.exports = router;
