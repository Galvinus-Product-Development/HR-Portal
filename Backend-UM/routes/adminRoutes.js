const express = require("express");
const {authenticate, checkPermission} =require("../middlewares/authMiddleware")
//controllers
const { assignRole, assignRolePermission,sendRegistrationLink,completeRegistration ,deleteUser} = require("../controllers/adminController");
const { createRoleController, deleteRoleController, createPermissionController, deletePermissionController,removeRolePermission } = require("../controllers/rolePermissionController");
//middlewares
// const checkRole = require("../middlewares/roleMiddleware");
// const checkPermission = require("../middlewares/permissionMiddleware");

const router = express.Router();

// Only Super Admins or Admins can assign roles
// router.post("/assign-role", authenticate,checkRole(["SUPER_ADMIN", "ADMIN"]), assignRole);
// router.post("/assign-role", authenticate,authorizeRoles("assign_role"), assignRole);

router.post("/assign-role", authenticate,checkPermission("assign_role"), assignRole);

// Only Super Admins can assign permissions to roles
router.post("/assign-role-permission",authenticate, checkPermission("assign_role_permission"), assignRolePermission);

// router.post("/assign-role-permission",authenticate, assignRolePermission);


router.post("/remove-role-permission", authenticate, checkPermission("remove_role_permission"), removeRolePermission);
// router.post("/remove-role-permission", authenticate,  removeRolePermission);

// Only "admin" and "superadmin" can access this route
// router.get("/admin/dashboard", checkRole(["admin", "superadmin"]), userController.adminDashboard);


// Only users with "manage_users" permission can delete a user
// router.delete("/delete-user/:userId", checkPermission(["manage_users"]), adminController.deleteUser);



router.post("/roles", authenticate,checkPermission("create_role"), createRoleController); // Create role
router.delete("/roles/:roleId",authenticate,checkPermission("delete_role"),  deleteRoleController); // Delete role

// router.post("/permissions", authenticate,checkRole(["SUPER_ADMIN", "ADMIN"]), createPermissionController); // Create permission
// router.delete("/permissions/:permissionId", authenticate,checkRole(["SUPER_ADMIN", "ADMIN"]), deletePermissionController); // Delete permission


// Route for sending a registration link (Super Admin only)
router.post("/send-registration-link",authenticate,checkPermission("register_user"), sendRegistrationLink);

// Route for completing the registration process (No restrictions, as this is a public action)
router.post("/complete-registration/:token", completeRegistration);

// Route for deleting a user (Admin and Super Admin only)
router.delete("/delete-user",authenticate,checkPermission("delete_user"), deleteUser);
// authenticate, checkPermission("delete_user"), 
module.exports = router;