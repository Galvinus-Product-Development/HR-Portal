const express = require("express");
const router = express.Router();
const { fetchEmployees, fetchRoles, fetchPermissions } = require("../controllers/rolePermissionController");

router.get("/employees", fetchEmployees);
router.get("/roles", fetchRoles);
router.get("/permissions", fetchPermissions);

module.exports = router;
