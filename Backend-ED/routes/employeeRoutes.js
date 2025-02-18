const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
// const validateEmployee = require("../middlewares/validateEmployee");

// Employee Routes
router.post("/",  employeeController.createEmployee);
router.get("/", employeeController.getAllEmployees);
router.get("/formatted",employeeController.getFormattedEmployees);
router.get("/fetchEmployeeDetailsById/:id",employeeController.fetchEmployeeDetailsById);
router.get("/:id", employeeController.getEmployeeById);
router.put("/:id",  employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);



module.exports = router;
