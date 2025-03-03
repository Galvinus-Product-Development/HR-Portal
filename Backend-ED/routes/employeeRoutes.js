
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const checkPermission = require("../middlewares/checkPermission");

// Employee Routes (Admin Restricted)

router.get("/formatted", employeeController.getFormattedEmployees);
// router.get("/formatted", checkPermission("view_employee_details"), employeeController.getFormattedEmployees);
router.put("/update-all/:id", checkPermission("edit_employee_details"), employeeController.updateAllEmployeeDetails);
router.put("/approval-status/:id", checkPermission("approve_employee_details"), employeeController.updateApprovalStatus);
router.get("/fetchEmployeeDetailsById/:id", checkPermission("view_employee_details"), employeeController.fetchEmployeeDetailsById);

// Employee Routes (No Permission Required)
router.post("/personal-details", employeeController.submitPersonalDetails);
router.get("/employment/:userId", employeeController.getEmploymentDetails);
router.get("/bank-details/:userId", employeeController.getBankDetails);

module.exports = router;
