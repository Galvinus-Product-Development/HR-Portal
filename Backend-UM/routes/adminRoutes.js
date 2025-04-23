const express = require("express");
const {authenticate, checkPermission} =require("../middlewares/authMiddleware")

const { registerEmployeeUser } = require("../controllers/employeeRegisterController");
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


router.post("/remove-role-permission", authenticate, checkPermission("remove_role_permission"), removeRolePermission);



router.post("/roles", authenticate,checkPermission("create_role"), createRoleController); // Create role
router.delete("/roles/:roleId",authenticate,checkPermission("delete_role"),  deleteRoleController); // Delete role


// Route for sending a registration link (Super Admin only)
router.post("/send-registration-link",authenticate,checkPermission("register_user"), sendRegistrationLink);

// Route for completing the registration process (No restrictions, as this is a public action)
router.post("/complete-registration/:token", completeRegistration);

// Route for deleting a user (Admin and Super Admin only)
router.delete("/delete-user",authenticate,checkPermission("delete_user"), deleteUser);
// authenticate, checkPermission("delete_user"), 



router.post("/register-employee", registerEmployeeUser);



module.exports = router;