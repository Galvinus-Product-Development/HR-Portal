const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");

// Create a new employee
router.post("/add", employeeController.addEmployee);

// Get all employees
router.get("/", employeeController.getAllEmployees);

// Get an employee by ID
router.get("/:id", employeeController.getEmployeeById);

// Update employee details
router.put("/:id", employeeController.updateEmployee);

// Delete an employee
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
