const express = require("express");
const authenticate =require("../middlewares/authMiddleware")
//controllers
const { assignRole, assignRolePermission } = require("../controllers/adminController");

//middlewares
const checkRole = require("../middlewares/roleMiddleware");
const checkPermission = require("../middlewares/permissionMiddleware");

const router = express.Router();

// Only Super Admins or Admins can assign roles
router.post("/assign-role", authenticate,checkRole(["SUPER_ADMIN", "ADMIN"]), assignRole);

// Only Super Admins can assign permissions to roles
router.post("/assign-role-permission",authenticate, checkRole(["SUPER_ADMIN"]), assignRolePermission);


// Only "admin" and "superadmin" can access this route
// router.get("/admin/dashboard", checkRole(["admin", "superadmin"]), userController.adminDashboard);


// Only users with "manage_users" permission can delete a user
// router.delete("/delete-user/:userId", checkPermission(["manage_users"]), adminController.deleteUser);

module.exports = router;